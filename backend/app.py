# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from cv_reformatter import reformat_cv_with_llm
from config import DEBUG
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)


@app.route('/api/reformat', methods=['POST'])
def reformat_cv():
    try:
        # Check required files
        if 'cv' not in request.files or 'template' not in request.files:
            return jsonify({"error": "Both CV and template files are required"}), 400

        cv_file = request.files['cv']
        template_file = request.files['template']
        example_file = request.files.get('example')  # Optional file

        # Check if files are actually selected
        if cv_file.filename == '' or template_file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Pass files to reformatter
        reformatted_cv = reformat_cv_with_llm(cv_file, template_file, example_file)
        return jsonify({"reformattedCV": reformatted_cv})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=DEBUG)