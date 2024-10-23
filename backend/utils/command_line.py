import argparse
from pathlib import Path

def generate_output_filename(top_dir: Path, cv_file: str, template_file: str, example_file: str = None) -> str:
    cv_name = Path(cv_file).stem
    template_name = Path(template_file).stem
    example_name = Path(example_file).stem if example_file else "default"
    base_name = f"{cv_name}_{template_name}_{example_name}_result_"
    counter = 0
    while True:
        output_filename = Path(top_dir, f"{base_name}{counter:02d}.docx")
        if not Path(output_filename).exists():
            return output_filename
        counter += 1

def parse_arguments():
    parser = argparse.ArgumentParser(description="Reformat CV using LangChain and Ollama model.")
    parser.add_argument("top_directory", type=str, help="Top directory where the input files are located")
    parser.add_argument("cv_file", type=str, help="Name of the CV file")
    parser.add_argument("template_file", type=str, help="Name of the template file")
    parser.add_argument("example_file", type=str, nargs='?', default=None, help="Name of the example file (optional)")
    return parser.parse_args()

def get_filenames():
    args = parse_arguments()
    top_directory = Path(args.top_directory)
    cv_file = top_directory / args.cv_file
    template_file = top_directory / args.template_file
    example_file = top_directory / args.example_file if args.example_file else None
    return top_directory,cv_file,template_file,example_file