from fastapi import APIRouter
from pydantic import BaseModel
from services.mock_data import get_fi_data_by_type

router = APIRouter(prefix="/api/docs", tags=["Financial Docs"])

class TranslateRequest(BaseModel):
    jargon_text: str

def mock_genz_llm_translate(text: str) -> str:
    """ Mock logic for integrating an LLM (like Google Gemini)"""
    mapping = {
        "Waiver of premium": "Basically, if something bad happens to you, the insurance company pays the monthly bill for you. No cap.",
        "Sum Assured": "The fat bag of cash your family gets if you pass away. W.",
        "Maturity Date": "The day your investments finally glow up and drop the bag in your account."
    }
    return mapping.get(text, "Bro it's literally just finance talk. You give them money, they hold it.")

@router.get("/all")
def get_all_docs():
    """
    Returns the static documentation products (Filing Cabinet)
    """
    return {
        "insurance_policies": get_fi_data_by_type("INSURANCE_POLICIES"),
        "term_deposits": get_fi_data_by_type("TERM_DEPOSIT"),
        "epf": get_fi_data_by_type("EPF")
    }

@router.post("/translate")
def translate_jargon(req: TranslateRequest):
    """
    Takes confusing financial Jargon and translates it into Gen Z explanation via LLM.
    """
    translation = mock_genz_llm_translate(req.jargon_text)
    return {
        "original": req.jargon_text,
        "translated": translation
    }
