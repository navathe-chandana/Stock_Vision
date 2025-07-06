import numpy as np
import pandas as pd
import os
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler

def predict_stock(ticker, days):
    try:
        print(f"✅ Called predict_stock with ticker={ticker}, days={days}")

        # Check if model exists, if not create it
        model_path = os.path.join("model", "Stock Predictions Model.keras")
        
        if not os.path.exists("model"):
            os.makedirs("model")
        
        if not os.path.exists(model_path):
            print("Model not found. Creating a new model...")
            model = create_lstm_model()
            
            if not os.path.exists("data"):
                os.makedirs("data")
            
            data_path = os.path.join("data", "Apple_Stock_Data.csv")
            if not os.path.exists(data_path):
                generate_sample_stock_data(data_path)

            train_model(model, data_path)
            model.save(model_path)
        else:
            model = load_model(model_path)

        df = pd.read_csv(os.path.join("data", "Apple_Stock_Data.csv"))
        df = df.sort_values("Date")
        close_prices = df['Close'].values.reshape(-1, 1)

        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(close_prices)

        seq_length = 60

        if len(scaled_data) < seq_length:
            additional_needed = seq_length - len(scaled_data)
            pad_data = np.tile(scaled_data[-1:], (additional_needed, 1))
            scaled_data = np.vstack([scaled_data, pad_data])

        current_batch = scaled_data[-seq_length:].reshape((1, seq_length, 1))

        future_predictions = []
        for _ in range(days):
            next_pred = model.predict(current_batch, verbose=0)[0]
            future_predictions.append(next_pred)
            current_batch = np.append(current_batch[:, 1:, :], [[next_pred]], axis=1)

        future_prices = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

        start_date = pd.to_datetime(df['Date'].max())
        prediction_dates = pd.bdate_range(start=start_date + pd.Timedelta(days=1), periods=days)

        prediction_df = pd.DataFrame({
            'Date': prediction_dates,
            'Predicted Price': future_prices.flatten()
        })

        print("✅ prediction_df head:\n", prediction_df.head())
        return prediction_df

    except Exception as e:
        print(f"❌ Error in predict_stock: {str(e)}")
        return None  # Fallback so Flask can handle it cleanly


def create_lstm_model():
    # Create a simple LSTM model for stock prediction
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(model, data_path):
    # Load data
    df = pd.read_csv(data_path)
    df = df.sort_values("Date")
    close_prices = df['Close'].values.reshape(-1, 1)
    
    # Scale data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(close_prices)
    
    # Create training data
    x_train, y_train = [], []
    seq_length = 60
    
    if len(scaled_data) <= seq_length:
        # Not enough data, create synthetic patterns
        scaled_data = np.tile(scaled_data, (seq_length//len(scaled_data) + 1, 1))
    
    for i in range(seq_length, len(scaled_data)):
        x_train.append(scaled_data[i-seq_length:i, 0])
        y_train.append(scaled_data[i, 0])
        
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    
    # Train model (quick training just to create a functional model)
    model.fit(x_train, y_train, epochs=5, batch_size=32, verbose=0)

def generate_sample_stock_data(file_path):
    # Generate sample Apple stock data
    dates = pd.date_range(end=pd.Timestamp.today(), periods=200, freq='B')
    
    # Create a price trend with some randomness
    price = 150.0  # Starting price
    prices = []
    for _ in range(200):
        price = price * (1 + np.random.normal(0, 0.01))  # Daily return with noise
        prices.append(price)
    
    # Create DataFrame
    df = pd.DataFrame({
        'Date': dates.strftime('%Y-%m-%d'),
        'Open': [p * (1 - np.random.uniform(0, 0.01)) for p in prices],
        'High': [p * (1 + np.random.uniform(0, 0.01)) for p in prices],
        'Low': [p * (1 - np.random.uniform(0, 0.01)) for p in prices],
        'Close': prices,
        'Volume': [int(np.random.uniform(50000000, 150000000)) for _ in range(200)]
    })
    
    # Save to CSV
    df.to_csv(file_path, index=False)
    print(f"Generated sample stock data at {file_path}")

def generate_dummy_predictions(days):
    # Generate some dummy predictions if everything else fails
    start_date = pd.Timestamp.today()
    prediction_dates = pd.bdate_range(start=start_date + pd.Timedelta(days=1), periods=days)
    
    # Create a reasonable price trend starting at $180
    start_price = 180.0
    prices = [start_price]
    for i in range(1, days):
        # Add a slight upward trend with some noise
        next_price = prices[-1] * (1 + np.random.normal(0.001, 0.008))
        prices.append(next_price)
    
    return pd.DataFrame({
        'Date': prediction_dates,
        'Predicted Price': prices
    })


def get_analyst_opinion(predictions_df):
    # Calculate the trend slope
    prices = predictions_df['Predicted Price'].values
    trend = prices[-1] - prices[0]
    
    if trend > 5:
        buy, hold, sell = 70, 20, 10
        recommendation = "Buy"
    elif trend < -5:
        buy, hold, sell = 10, 20, 70
        recommendation = "Sell"
    else:
        buy, hold, sell = 25, 50, 25
        recommendation = "Hold"
    
    return {
        "buy": buy,
        "hold": hold,
        "sell": sell,
        "recommendation": recommendation
    }



