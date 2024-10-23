import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaLLM

from parse_docx import extract_text_from_docx
from prompt_template import create_prompt
# import config
from config import LOCAL_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

"""
def load_aws():
    import boto3
    from langchain_aws import ChatBedrock
    #MODEL_NAME = "anthropic.claude-3-haiku-20240307-v1:0"  # or any other model you prefer
    MODEL_NAME = "anthropic.claude-3-5-sonnet-20240620-v1:0"

    logging.debug("Creating boto3 session")
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        aws_session_token=AWS_SESSION_TOKEN,  # Include this for temporary credentials
        region_name=AWS_DEFAULT_REGION
    )

    logging.debug("Creating ChatBedrock instance")
    llm = ChatBedrock(
        model_id=MODEL_NAME,
        model_kwargs=dict(temperature=0),
        client=session.client("bedrock-runtime")
    )
    return llm
#"""

def load_llm():
    if LOCAL_MODEL == "ollama":

        # Initialize the Ollama model
        llm = OllamaLLM(
            model="mistral",  # Replace with the actual model name you want to use
            api_key=None,  # Replace with your actual API key
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        logging.info("Using Ollama model: mistral")
        return llm
    else:
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



def reformat_cv_with_llm(cv_file: str, template_file: str, example_file: str) -> str:
    """
    Reformat the CV content according to the given template using LangChain.
    """

    """
    cv_content=extract_text_from_docx("data/cv.docx")
    template_content=extract_text_from_docx("data/template.docx")
    example_content = extract_text_from_docx("data/example.docx")
    #"""
    logging.info("Extracting text from CV file")
    cv_content = extract_text_from_docx(cv_file)
    logging.debug(f"CV content extracted: {cv_content[:100]}...")

    logging.info("Extracting text from template file")
    template_content = extract_text_from_docx(template_file)
    logging.debug(f"Template content extracted: {template_content[:100]}...")

    logging.info("Extracting text from example file")
    example_content = extract_text_from_docx(example_file)
    logging.debug(f"Example content extracted: {example_content[:100]}...")

    logging.debug("Loading LLM")
    llm = load_llm()

    logging.info("Creating prompt")
    prompt = create_prompt(cv_content, template_content, example_content)
    logging.debug(f"Prompt created: {prompt[:100]}...")

    logging.info("Invoking LLM with prompt")
    result = llm.invoke(prompt)

    logging.info("Parsing LLM result")
    parser = StrOutputParser()
    result = parser.invoke(result)
    logging.debug(f"Parsed result: {result[:100]}...")

    return result
