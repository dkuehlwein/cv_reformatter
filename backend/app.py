from flask import Flask, request, jsonify
from flask_cors import CORS
from cv_reformatter import reformat_cv_with_llm
from config import DEBUG

app = Flask(__name__)
CORS(app)

@app.route('/api/reformat', methods=['POST'])
def reformat_cv():
    try:
        cv_file = request.files.get('cv')
        template_file = request.files.get('template')
        example_file = request.files.get('example')

        if not cv_file or not template_file:
            return jsonify({"error": "Both CV and template files are required"}), 400

        reformatted_cv = reformat_cv_with_llm(cv_file, template_file, example_file)
        return jsonify({"reformattedCV": reformatted_cv})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=DEBUG)