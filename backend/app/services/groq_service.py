import json
import re
from groq import Groq
from ..config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

# ─── Original Legal Helper prompt (unchanged for the full-page chatbot) ───
SYSTEM_PROMPT = """You are a Legal & Welfare Assistant for Indian citizens. Your role is to:

1. Help citizens understand government welfare schemes they may be eligible for
2. Explain legal rights in simple, plain language
3. Guide users on required documents and application processes
4. Provide information about eligibility criteria
5. Explain government policies and entitlements

Important guidelines:
- Always be helpful, empathetic, and clear
- Use simple language, avoid legal jargon where possible
- When discussing schemes, mention the scheme name, key benefits, and how to apply
- Always clarify that you provide general guidance, not formal legal advice
- If you're unsure about something, say so rather than making up information
- Focus on Indian government schemes (central and state level)
- You can respond in English or Hindi based on the user's language
- Start responses with relevant information, not greetings (unless it's the first message)

You have knowledge of major Indian government schemes including:
- PM Kisan Samman Nidhi (farmer income support)
- Ayushman Bharat / PMJAY (health insurance)
- PM Awas Yojana (housing)
- MGNREGA (rural employment)
- PM Ujjwala Yojana (LPG connections)
- Beti Bachao Beti Padhao (girl child welfare)
- PM Mudra Yojana (micro-enterprise loans)
- Sukanya Samriddhi Yojana (girl child savings)
- Jan Dhan Yojana (financial inclusion)
- Startup India
- Digital India
- Various state-level schemes
"""

# ─── Widget Copilot prompt (context-aware, navigator, multilingual) ───
WIDGET_SYSTEM_PROMPT = """You are the AI Copilot for SchemesMadeSimple, a government welfare schemes portal. You exist as a floating chat widget visible on every page.

YOU HAVE 4 SUPERPOWERS:

## 1. Context-Aware Assistant
You receive the user's current page URL and any scheme they may be viewing. Use this context to personalize your answers. If the user is viewing a specific scheme, answer questions about THAT scheme specifically without asking them to repeat its name.

## 2. UI Navigator
You can control the website! When the user wants to navigate somewhere, include an "action". Available actions and EXACT valid payloads:

- navigate: Navigate to a page. The payload MUST be EXACTLY one of these 5 strings, nothing else: "/", "/schemes", "/discover", "/legal-helper", "/about". Do NOT invent other paths like /schemes/pm-kisan.
- filter: Filter schemes by category. Payload must be EXACTLY one of: "Agriculture", "Education", "Finance", "Health", "Housing", "Technology", "Employment", "Women & Children", "Social Welfare", "Youth & Seniors"
- search: Search for schemes. Payload: the search query string (e.g. "PM Kisan farmers")
- open_discover: Open the Discover page. Payload: comma-separated profile tags from: Farmer, Student, Woman, Senior Citizen 60+, BPL / Below Poverty Line, Differently Abled / Disabled, Urban Poor, Migrant Worker, Entrepreneur / Self-Employed, SC / ST / OBC, Pregnant / New Mother, Child (0-18), Youth (18-35)

## 3. Multilingual Support
Detect the language of the user's message. Respond in the SAME language. Set "detected_language" accordingly (use ISO codes: en, hi, ta, te, bn, mr, gu, kn, ml, pa, or, as, ur).

## 4. Accessibility-First
Keep responses concise (under 120 words for the widget). Use simple words. Be friendly yet informative. Use numbered lists for steps. Write amounts clearly (e.g. "Rs. 6,000 per year").

## RESPONSE FORMAT — CRITICAL
You MUST output ONLY a raw JSON object with NO text before or after it. No prose, no markdown, no code fences. Just the JSON:
{"reply": "Your helpful message here", "action": {"type": "none", "payload": null}, "detected_language": "en"}

Rules:
- action.type must be one of: "navigate", "filter", "search", "open_discover", "none"
- navigate payload MUST be one of the 5 exact paths above. If the user asks about a specific scheme (e.g. PM Kisan), use action type "search" with payload "PM Kisan", not navigate.
- If no action is needed, use: {"type": "none", "payload": null}
- Always set detected_language.
- Do NOT include any text outside the JSON object. Start your response with { and end with }.
"""


async def get_chat_response(user_message: str) -> str:
    """Get a response from Groq LLM for the full-page Legal & Welfare Assistant."""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            model=settings.GROQ_MODEL,
            temperature=0.7,
            max_tokens=1024,
            top_p=0.9,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"I'm sorry, I'm having trouble processing your request right now. Please try again later. Error: {str(e)}"


async def get_widget_chat_response(
    user_message: str,
    page_context: str | None = None,
    scheme_context: str | None = None,
    conversation_history: list[dict] | None = None,
) -> dict:
    """Get a structured response from Groq LLM for the floating widget copilot."""
    # Build the full user prompt with context
    context_parts = []
    if page_context:
        context_parts.append(f"[USER IS CURRENTLY ON PAGE: {page_context}]")
    if scheme_context:
        context_parts.append(f"[USER IS VIEWING SCHEME: {scheme_context}]")

    context_prefix = "\n".join(context_parts)
    full_user_message = f"{context_prefix}\n\nUser message: {user_message}" if context_parts else user_message

    # Build messages with conversation history for continuity
    messages = [{"role": "system", "content": WIDGET_SYSTEM_PROMPT}]

    if conversation_history:
        for msg in conversation_history[-6:]:  # Keep last 6 messages for context window
            role = "user" if msg.get("role") == "user" else "assistant"
            messages.append({"role": role, "content": msg.get("content", "")})

    messages.append({"role": "user", "content": full_user_message})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=settings.GROQ_MODEL,
            temperature=0.6,
            max_tokens=512,
            top_p=0.9,
        )

        raw_response = chat_completion.choices[0].message.content.strip()

        # ── Robust JSON extraction ─────────────────────────────────────────
        # The LLM sometimes wraps JSON in prose or code fences. We search for
        # the outermost JSON object { ... } using regex as the authoritative parser.
        json_str = None

        # 1. Try to extract from code fences first (```json ... ```)
        fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_response, re.DOTALL)
        if fence_match:
            json_str = fence_match.group(1)
        else:
            # 2. Find the outermost { ... } block in the response
            brace_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
            if brace_match:
                json_str = brace_match.group(0)

        if json_str:
            parsed = json.loads(json_str)
        else:
            raise json.JSONDecodeError("No JSON object found", raw_response, 0)

        return {
            "reply": parsed.get("reply", raw_response),
            "action": parsed.get("action", {"type": "none", "payload": None}),
            "detected_language": parsed.get("detected_language", "en"),
        }

    except json.JSONDecodeError:
        # If we truly cannot extract JSON, wrap the raw text as a plain reply
        # but strip out any residual JSON artifacts for clean display
        clean_text = re.sub(r"\{[^{}]*\"reply\"[^{}]*\}", "", raw_response, flags=re.DOTALL).strip()
        return {
            "reply": clean_text if clean_text else "I'm here to help! Could you rephrase that?",
            "action": {"type": "none", "payload": None},
            "detected_language": "en",
        }
    except Exception as e:
        return {
            "reply": f"I'm sorry, I'm having trouble right now. Please try again.",
            "action": {"type": "none", "payload": None},
            "detected_language": "en",
        }

EXTRACTION_PROMPT = """You are an expert data extractor specializing in Indian Government Welfare Schemes.
Your task is to extract structured scheme information from the provided scraped web text.

### CRITICAL RULES:
1. Output MUST be a valid JSON array of objects. 
2. If the text is incomplete or messy, try your best to extract logical information.
3. If no clear scheme is found, return an empty array `[]`.
4. Ensure the fields are as detailed as possible based on the source text.
5. "title" must be unique and descriptive.

### SCHEMA:
Each object in the array must have these exact keys:
- "title": (string) Full name of the scheme.
- "description": (string) Clear summary of what the scheme does.
- "category": (string) Must be ONE OF: Agriculture, Education, Finance, Health, Housing, Technology, Employment, Women & Children, Social Welfare, Youth & Seniors.
- "state": (string) State name (e.g., "Maharashtra") or "Central".
- "eligibility": (string) Detailed eligibility criteria.
- "benefits": (string) Quantifiable benefits (e.g., "Rs. 5000 per month").
- "documents_required": (string) List of documents.
- "application_process": (string) Step-by-step application guide.
- "application_url": (string) Direct official link if found, else null.
- "source": (string) Official Department or Ministry name.
- "scheme_type": (string) Either "central" or "state".

### FORMAT:
Respond ONLY with the raw JSON array. No preamble, no explanation, no markdown code blocks.
Example: [{"title": "..."}, {"title": "..."}]
"""

async def extract_schemes_from_text(scraped_text: str) -> list[dict]:
    """Extract structured scheme data from raw scraped text using Groq."""
    if not scraped_text.strip():
        return []
        
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": EXTRACTION_PROMPT},
                {"role": "user", "content": f"Scraped Text:\n{scraped_text}"},
            ],
            model="llama-3.3-70b-versatile", # Using a highly capable model for extraction
            temperature=0.1,
            max_tokens=2048,
        )
        
        raw_response = completion.choices[0].message.content.strip()
        
        # Robust JSON array extraction
        match = re.search(r"\[.*\]", raw_response, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
        return []
    except Exception as e:
        print(f"Extraction error: {e}")
        return []
