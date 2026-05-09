# Stock Price Prediction Web Application

##  Project Overview

A Flask-based web application that uses LSTM (Long Short-Term Memory) neural networks to predict future stock prices. The application provides interactive visualizations, prediction tables, and analyst opinions to help users make informed decisions about stock investments.

## ✨ Features

- **Stock Price Prediction**: Predict stock prices for multiple days ahead using deep learning
- **Interactive Charts**: Dynamic SVG-based charts with hover tooltips showing price predictions
- **Prediction Table**: Detailed table view with date, predicted price, and trend indicators
- **Analyst Opinion**: AI-generated buy/sell/hold recommendations based on prediction trends
- **Visual Pie Chart**: Colorful pie chart showing confidence distribution across buy/sell/hold decisions
- **Multiple Stock Support**: Pre-configured for popular stocks (AAPL, MSFT, GOOGL, AMZN, META, TSLA)
- **REST API**: JSON API endpoint for programmatic access

## 🛠️ Technologies Used

### Backend
- **Flask**: Web framework for Python
- **TensorFlow/Keras**: Deep learning framework for LSTM model
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **scikit-learn**: Data preprocessing and scaling

### Frontend
- **HTML5/CSS3**: Modern web interface
- **JavaScript**: Dynamic chart generation and interactivity
- **SVG**: Scalable vector graphics for charts

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone or download the project**
   ```bash
   cd stock-prediction-app
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install required dependencies**
   ```bash
   pip install flask tensorflow pandas numpy scikit-learn
   ```

## 📁 Project Structure

```
stock-prediction-app/
│
├── app.py                          # Flask application main file
├── utils.py                        # LSTM model and prediction utilities
├── chart.js                        # Chart rendering and visualization
│
├── templates/
│   └── index.html                  # Main web interface
│
├── data/
│   └── Apple_Stock_Data.csv       # Historical stock data (auto-generated)
│
├── model/
│   └── Stock Predictions Model.keras  # Trained LSTM model (auto-generated)
│
└── README.md                       # This file
```

## 🎯 Usage

### Starting the Application

1. **Run the Flask server**
   ```bash
   python app.py
   ```

2. **Access the application**
   - Open your web browser
   - Navigate to: `http://127.0.0.1:5000/`

### Using the Web Interface

1. **Select a stock ticker** from the dropdown (AAPL, MSFT, GOOGL, etc.)
2. **Choose prediction period** (1-30 days)
3. **Click "Predict"** to generate predictions
4. **View results**:
   - Interactive price chart with hover tooltips
   - Detailed prediction table with trend indicators
   - Analyst opinion boxes (Buy/Sell/Hold percentages)
   - Pie chart visualization of recommendations

### Using the API

**Endpoint**: `POST /api/predict`

**Request Example**:
```bash
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "days": 7}'
```

**Response Example**:
```json
{
  "prediction": [
    {
      "Date": "2026-05-11",
      "Predicted Price": 182.45
    },
    {
      "Date": "2026-05-12",
      "Predicted Price": 183.20
    }
  ]
}
```

## 🤖 How It Works

### LSTM Model
- **Architecture**: 2-layer LSTM network with dropout regularization
- **Input**: 60-day historical price sequences
- **Output**: Next-day price prediction
- **Training**: Automatic on first run if model doesn't exist

### Prediction Process
1. Load or create LSTM model
2. Retrieve historical stock data
3. Normalize data using MinMaxScaler
4. Generate sequential predictions for specified days
5. Inverse transform to actual price values

### Analyst Opinion Logic
The application analyzes prediction trends to generate recommendations:
- **Buy**: Strong upward trend detected
- **Hold**: Stable or moderate trend
- **Sell**: Strong downward trend detected

Percentages are calculated based on:
- Overall trend direction
- Price volatility
- Confidence metrics

## 📊 Features Breakdown

### Interactive Chart
- Real-time hover tooltips showing exact date and price
- Gradient-filled area chart
- Responsive SVG design
- Auto-scaling axes

### Prediction Table
- Color-coded trend indicators (▲ up, ▼ down)
- Percentage change calculations
- Highlighted target date rows

### Analyst Opinion
- Three colorful boxes: Buy (green), Hold (yellow), Sell (red)
- Percentage confidence for each recommendation
- Dynamic pie chart visualization
- Data-driven calculations

## 🔧 Configuration

### Adding New Stock Tickers

Edit `chart.js` to add starting prices:

```javascript
function getStartPrice(ticker) {
    const prices = {
        'AAPL': 172.50,
        'MSFT': 315.75,
        'YOUR_TICKER': 100.00  // Add here
    };
    return prices[ticker] || 100;
}
```

### Adjusting Prediction Model

Modify `utils.py` to change model architecture:

```python
def create_lstm_model():
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    model.add(Dropout(0.2))
    # Add more layers here
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model
```

## ⚠️ Important Notes

- **Educational Purpose**: This application is for educational and demonstration purposes only
- **Not Financial Advice**: Predictions should NOT be used for actual trading decisions
- **Model Limitations**: LSTM predictions are based on historical patterns and may not reflect future market conditions
- **Market Volatility**: Stock markets are influenced by numerous unpredictable factors
- **Risk Warning**: Always consult with financial professionals before making investment decisions

## 🐛 Troubleshooting

### Model Not Loading
- Delete the `model` folder and restart the app to retrain
- Check TensorFlow installation: `pip install --upgrade tensorflow`

### Data Issues
- Delete the `data` folder to regenerate sample data
- Ensure CSV files have correct format (Date, Open, High, Low, Close, Volume)

### Port Already in Use
```bash
# Change port in app.py
app.run(debug=True, port=5001)
```

### Package Installation Errors
```bash
# Use specific versions if needed
pip install tensorflow==2.13.0
pip install flask==2.3.0
```

## 🔮 Future Enhancements

- [ ] Real-time data integration (Yahoo Finance, Alpha Vantage API)
- [ ] Multiple model comparison (LSTM, GRU, Transformer)
- [ ] Historical accuracy tracking
- [ ] User authentication and saved predictions
- [ ] Export predictions to CSV/PDF
- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] News sentiment analysis integration

## 📄 License

This project is open-source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For questions or issues, please create an issue in the project repository.

---

**Disclaimer**: This application is for educational purposes only. Stock market predictions are inherently uncertain. Never invest money you cannot afford to lose. Always do your own research and consult with qualified financial advisors before making investment decisions.
