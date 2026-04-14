from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os

router = APIRouter(prefix="/translate", tags=["Translate"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

class TranslateRequest(BaseModel):
    text: str

PREFILLED_CACHE = {
    "Employer and employee mandated contributions calculated at 12% of basic salary, yielding compounding sovereign-backed returns with strict temporal withdrawal covenants.": "Mandatory 12% pay cut matched by your boss. Safe AF, grows over time, but you can't touch it until you're old.",
    "A statutorily locked-in sovereign instrument compounding annually, restricting principal liquidation until a 15-year maturation horizon.": "Gov-backed stash that locks your cash for 15 years. Super safe, zero risk, just forget about it.",
    "Capital allocation locked in fixed-tenure deposit certificates yielding 7.10% per annum, subject to early-withdrawal penal clauses.": "Locking cash away for a set time at 7.10%. Try to pull it early and get penalized fr fr.",
    "Monthly compulsory amortization into interest-bearing time deposits, aggregating principal over predetermined periodic cycles.": "Forced monthly savings that stack up interest. Big brain way to build a pile slowly.",
    "Fixed-income debt instruments amortizing over an eight-year maturity cycle with semi-annual coupon distribution.": "Safe loans you give to the gov/corps for 8 years. They pay you rent on your money twice a year.",
    "Systematic Investment Plans allocated 60/40 across large-cap equilibrium and short-duration debt structures, subject to NAV volatility.": "SIPs on autopilot splitting your cash between big stocks and safe debt. Ups and downs happen.",
    "Passively managed depository vehicles tracking the NIFTY 50 index with negligible expense ratios, facilitating broad market exposure.": "Cheap bundle of the top 50 companies. Follows the market vibe without the crazy fees.",
    "Comprehensive term life contingencies hedging against mortality risk with high sum-assured multipliers relative to annualized premium outlays.": "Paying a tiny bit now so if you die, your fam gets a massive payout. Basic survival logic.",
    "A hybrid structured product allocating partial premium towards mortality hedging while deploying the residual corpus into equity-linked NAVs.": "Two-in-one combo: buys you life insurance AND throws whatever is left into the stock market.",
    "Unsecured revolving credit facilities operating on a 30-day interest-free billing cycle prior to extreme APR penal compound generation.": "Free money for 30 days. Miss the deadline and the interest will literally end you.",
    "Secured amortizing debt obligations with front-loaded interest schedules and predefined equated monthly installment structures.": "Paying off big purchases slowly. The catch? You pay mostly interest upfront before making a dent."
}

@router.post("/")
def translate_to_genz(req: TranslateRequest):
    """
    Translates heavy financial jargon to easy GenZ slang.
    """
    cleaned_input = req.text.strip()
    if cleaned_input in PREFILLED_CACHE:
        return {"translatedText": PREFILLED_CACHE[cleaned_input]}
        
    if not client:
        return {"translatedText": "No AI configured. TL;DR: It's broken rn fr fr."}
        
    prompt = f"""
    You are Monager, the hyper-intelligent GenZ financial twin. 
    A user is reviewing their boring financial document full of corporate jargon. 
    Translate the following heavy financial jargon into very easy GenZ slang wording. 
    Keep it short, punchy, fun, and easy to understand.
    Do not use hashtags or emojis.
    
    Original Text:
    {cleaned_input}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        translated = response.text.strip()
        PREFILLED_CACHE[cleaned_input] = translated
        return {"translatedText": translated}
    except Exception as e:
        print(f"Translation error: {e}")
        return {"translatedText": "Error generating translation. Rip."}
