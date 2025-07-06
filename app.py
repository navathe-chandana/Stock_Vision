from flask import Flask, render_template, jsonify, request
from utils import predict_stock, get_analyst_opinion  # ✅ ADD get_analyst_opinion here
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    opinion = None  # ✅ ADD this

    if request.method == 'POST':
        ticker = request.form.get('ticker')
        days = int(request.form.get('days'))
        
        try:
            prediction = predict_stock(ticker, days)
            opinion = get_analyst_opinion(prediction)  # ✅ ADD this
            print("Prediction returned:", prediction)
            print("Opinion generated:", opinion)

        except Exception as e:
            print(f"Error generating prediction: {str(e)}")
            return render_template('index.html', error=f"Error generating prediction: {str(e)}" , opinion=None)
        
    prediction_data = prediction.to_dict(orient='records') if prediction is not None else None
    return render_template('index.html', prediction=prediction_data, opinion=opinion)  # ✅ Modified to include opinion


# API route for JSON-based requests (Postman)
@app.route('/api/predict', methods=['POST'])
def api_predict():
    try:
        data = request.get_json()
        print("Received JSON:", data)  # Debug print

        ticker = data.get('ticker')
        days = data.get('days')

        if not ticker or not days:
            return jsonify({'error': 'Missing ticker or days'}), 400

        days = int(days)
        prediction = predict_stock(ticker, days)
        prediction_data = prediction.to_dict(orient='records')
        opinion = get_analyst_opinion(prediction)  # ✅ ADD this line

        return jsonify({'prediction': prediction_data, 'opinion': opinion})  # ✅ Include opinion in response
    except Exception as e:
        print("Exception:", e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    os.makedirs('model', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    app.run(debug=True)
