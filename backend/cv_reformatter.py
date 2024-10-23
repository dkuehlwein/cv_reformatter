import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaLLM

from parse_docx import extract_text_from_docx
from prompt_template import create_prompt
from config import LOCAL_MODEL

from utils.formatting import save_text
from utils.command_line import generate_output_filename, get_filenames

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_llm():
    if LOCAL_MODEL is None:
        from langchain_openai import AzureChatOpenAI
        deployment = "gpt-4o-mini"
        llm = AzureChatOpenAI(
            azure_deployment=deployment,  # or your deployment
            api_version="2024-08-01-preview",  # or your api version
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        logging.info(f"Using {deployment}")
        return llm
    
    elif "ollama" in LOCAL_MODEL:
        # Initialize the Ollama model
        model_name = LOCAL_MODEL.split('/')[1]
        llm = OllamaLLM(
            model=model_name,  # Replace with the actual model name you want to use
            api_key=None,  # No API key needed for local models
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        logging.info(f"Using Ollama model: {model_name}")
        return llm

def reformat_cv_with_llm(cv_file: str, template_file: str, example_file: str = None) -> str:
    """
    Reformat the CV content according to the given template using LangChain.
    """
    llm = load_llm()

    cv_content = extract_text_from_docx(cv_file)
    template_content = extract_text_from_docx(template_file)
    example_content = extract_text_from_docx(example_file) if example_file else ""

    # Create the prompt
    prompt = create_prompt(cv_content, template_content, example_content)

    # Use the llm to generate the reformatted CV content
    response = llm.generate([prompt])  # Wrap the prompt in a list
    
    # Assuming the response has a 'generations' attribute that contains the generated text
    if hasattr(response, 'generations') and response.generations:
        # Extract text from the first generation
        generated_text = response.generations[0][0].text
        return generated_text
    else:
        raise ValueError("Unexpected response structure: 'generations' attribute not found or empty")


def main():
    top_directory, cv_file, template_file, example_file = get_filenames()
    reformatted_cv = reformat_cv_with_llm(cv_file, template_file, example_file)
    output_filename = generate_output_filename(top_directory, cv_file, template_file, example_file)
    
    # Save the reformatted CV to a .docx file
    save_text(reformatted_cv, output_filename)    
    print(f"Reformatted CV saved to {output_filename}")


if __name__ == "__main__":
    main()