from docx import Document

def save_text(text: str, output_filename: str) -> None:
    doc = Document()
    doc.add_paragraph(text)
    doc.save(output_filename)
