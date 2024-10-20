# CV Reformatter

CV Reformatter is a web application that helps users reformat their CVs (Curriculum Vitae) to match specific templates. It consists of a React frontend for the user interface and a Flask backend for processing the CVs.

## Features

- Upload and preview CV, template, and example files (supports DOCX, PDF, and PPTX formats)
- Reformat CV based on the provided template
- Preview reformatted CV with markdown rendering
- Copy reformatted CV to clipboard or download as a markdown file
- Responsive design for various screen sizes

## Project Structure

The project is divided into two main parts:

- `/frontend`: React-based user interface
- `/backend`: Flask-based API for CV processing

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm (usually comes with Node.js)
- Python (version 3.7 or later)
- pip (Python package manager)

### Installation and Setup

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The frontend will be available at [http://localhost:3000](http://localhost:3000)

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. It's recommended to create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the Python server:
   ```
   python app.py
   ```

5. The backend API will be available at [http://localhost:5000](http://localhost:5000) (or whichever port is specified in your app.py)

## Usage

1. Ensure both the frontend and backend servers are running.
2. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.
3. Upload your current CV using the "Upload your CV" input.
4. Upload the template you want to use with the "Upload Template" input.
5. (Optional) Upload an example CV using the template with the "Upload Example" input.
6. Click the "Reformat CV" button to process your CV.
7. Once processed, you can view the reformatted CV, copy it to your clipboard, or download it as a markdown file.

## Development

- Frontend code is located in the `/frontend` directory. Make changes here for UI updates.
- Backend code is in the `/backend` directory. Modify this for changes to CV processing logic.
- Ensure to test both frontend and backend after making changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
