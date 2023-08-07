from flask import Flask, request, jsonify
from pycaret.regression import *
import pandas as pd
from flask_cors import CORS 
import json

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file included.'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file type.'}), 400
    data = pd.read_csv(file)
    # Setup PyCaret for Time Series Forecasting
    ts_setup = setup(data, session_id=123, data_split_shuffle=False, fold_strategy='timeseries')
    # Compare Models
    best_model = compare_models()
    # Get Model Metrics
    model_metrics = pull()
    model_metrics = model_metrics.to_json(orient="records")
    # Export Model to Pickle File
    save_model(best_model, 'time_series_model')
    return json.dumps({'status': 'success', 'model_metrics': model_metrics}), 200

if __name__ == '__main__':
    app.run(debug=True)
