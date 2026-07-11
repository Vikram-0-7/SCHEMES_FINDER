from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse, WidgetChatRequest, WidgetChatResponse, WidgetAction
from ..services.groq_service import get_chat_response, get_widget_chat_response

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message to the Legal & Welfare Assistant chatbot (full-page)."""
    reply = await get_chat_response(request.message)
    return ChatResponse(reply=reply)


@router.post("/widget", response_model=WidgetChatResponse)
async def widget_chat(request: WidgetChatRequest):
    """Send a message to the AI Copilot floating widget.
    Supports context-awareness, navigation commands, and multilingual responses.
    """
    result = await get_widget_chat_response(
        user_message=request.message,
        page_context=request.page_context,
        scheme_context=request.scheme_context,
        conversation_history=request.conversation_history,
    )

    action = None
    if result.get("action") and result["action"].get("type") != "none":
        action = WidgetAction(
            type=result["action"]["type"],
            payload=result["action"].get("payload"),
        )

    return WidgetChatResponse(
        reply=result["reply"],
        action=action,
        detected_language=result.get("detected_language", "en"),
    )
