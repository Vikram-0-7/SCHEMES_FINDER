import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Globe,
  Zap,
  ArrowRight,
  MapPin,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { sendWidgetMessage } from '../services/api';
import type { WidgetMessage } from '../types';
import './ChatWidget.css';

// ─── Suggestion prompts shown on first open ───────────────────────────────
const QUICK_SUGGESTIONS = [
  'Am I eligible for PM Kisan?',
  'Schemes for farmers 🌾',
  'Help me find housing schemes',
  'कौन-सी योजनाएं मुझे मिल सकती हैं?',
];

// ─── Helper: get human-readable page label ───────────────────────────────
function getPageLabel(pathname: string): string {
  const map: Record<string, string> = {
    '/': 'Home',
    '/schemes': 'All Schemes',
    '/discover': 'Discover Schemes',
    '/legal-helper': 'Legal Helper',
    '/about': 'About',
  };
  return map[pathname] ?? pathname;
}

// ─── Helper: action chip config ──────────────────────────────────────────
interface ActionConfig {
  icon: React.ReactNode;
  label: string;
}

function getActionConfig(type: string, payload: string | null): ActionConfig {
  switch (type) {
    case 'navigate':
      return { icon: <ArrowRight size={12} />, label: `Go to ${getPageLabel(payload ?? '/')}` };
    case 'filter':
      return { icon: <Zap size={12} />, label: `Filter: ${payload}` };
    case 'search':
      return { icon: <Zap size={12} />, label: `Search: "${payload}"` };
    case 'open_discover':
      return { icon: <ArrowRight size={12} />, label: `Discover for ${payload}` };
    default:
      return { icon: <ArrowRight size={12} />, label: 'Go' };
  }
}

// ─── Language display name ────────────────────────────────────────────────
const LANG_NAMES: Record<string, string> = {
  en: 'EN', hi: 'HI', ta: 'TA', te: 'TE', bn: 'BN',
  mr: 'MR', gu: 'GU', kn: 'KN', ml: 'ML', pa: 'PA',
  or: 'OR', as: 'AS', ur: 'UR',
};

// ─── Web Speech API types (browser built-in, no @types needed) ───────────
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }
}

// ─────────────────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(true); // badge on first load
  const [isListening, setIsListening] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Conversation history for multi-turn context
  const conversationHistoryRef = useRef<{ role: string; content: string }[]>([]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNew(false);
    }
  }, [isOpen]);

  // ── Open / Close ────────────────────────────────────────────────────────
  const closePanel = useCallback(() => {
    setIsClosing(true);
    // After animation, actually hide the panel
    const timer = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = () => {
    if (isOpen && !isClosing) {
      closePanel();
    } else if (!isOpen) {
      setIsClosing(false);
      setIsOpen(true);
    }
  };

  // ── Execute AI navigation commands ──────────────────────────────────────
  const executeAction = useCallback(
    (type: string, payload: string | null) => {
      if (!payload) return;
      // Note: we intentionally do NOT close the panel after navigation
      // so the user can keep chatting while on the new page.
      switch (type) {
        case 'navigate':
          navigate(payload);
          break;
        case 'filter':
          navigate(`/schemes?category=${encodeURIComponent(payload)}`);
          break;
        case 'search':
          navigate(`/schemes?search=${encodeURIComponent(payload)}`);
          break;
        case 'open_discover':
          navigate(`/discover?profiles=${encodeURIComponent(payload)}`);
          break;
      }
    },
    [navigate],
  );

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    const userMsg: WidgetMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    conversationHistoryRef.current.push({ role: 'user', content: messageText });
    setInput('');
    setLoading(true);

    try {
      const result = await sendWidgetMessage(
        messageText,
        `${location.pathname} (${getPageLabel(location.pathname)})`,
        undefined,
        conversationHistoryRef.current.slice(-6),
      );

      setDetectedLang(result.detected_language ?? 'en');

      const botMsg: WidgetMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        content: result.reply,
        timestamp: new Date(),
        action: result.action ?? undefined,
        detectedLanguage: result.detected_language ?? 'en',
      };

      setMessages((prev) => [...prev, botMsg]);
      conversationHistoryRef.current.push({ role: 'assistant', content: result.reply });

      // If action is a clear navigation intent, auto-execute after a short delay
      if (result.action && result.action.type !== 'none') {
        // We show the chip — user can click it. Don't auto-navigate.
      }
    } catch {
      const errMsg: WidgetMessage = {
        id: `e-${Date.now()}`,
        role: 'bot',
        content: "I'm having trouble connecting right now. Please ensure the backend is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ── Voice Input ─────────────────────────────────────────────────────────
  const toggleVoice = () => {
    const SpeechRecognitionClass =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = detectedLang === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ── Clear conversation ──────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    conversationHistoryRef.current = [];
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const currentPageLabel = getPageLabel(location.pathname);

  return (
    <>
      {/* ── Floating Panel ── */}
      {isOpen && (
        <div className={`chat-widget__panel${isClosing ? ' chat-widget__panel--closing' : ''}`} role="dialog" aria-label="AI Copilot Chat">
          {/* Header */}
          <div className="chat-widget__header">
            <div className="chat-widget__avatar">
              <Bot size={20} color="#fff" />
            </div>
            <div className="chat-widget__header-info">
              <h4>Scheme Copilot</h4>
              <div className="chat-widget__status">
                <span className="chat-widget__status-dot" />
                <span>AI · Online</span>
                {detectedLang !== 'en' && (
                  <>
                    <span>·</span>
                    <Globe size={10} />
                    <span>{LANG_NAMES[detectedLang] ?? detectedLang.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
            <div className="chat-widget__header-actions">
              <button
                className="chat-widget__icon-btn"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear conversation"
              >
                <RotateCcw size={14} />
              </button>
              <button
                className="chat-widget__icon-btn"
                onClick={closePanel}
                title="Close"
                aria-label="Close widget"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="chat-widget__context-banner">
            <MapPin size={11} />
            <span className="chat-widget__context-text">
              📍 You&apos;re on: <strong>{currentPageLabel}</strong>
            </span>
          </div>

          {/* Messages */}
          <div className="chat-widget__messages">
            {messages.length === 0 && (
              <div className="chat-widget__msg chat-widget__msg--bot">
                <div className="chat-widget__msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="chat-widget__bubble">
                  <p>
                    Namaste! 👋 I&apos;m your <strong>Scheme Copilot</strong> — I can help you find
                    government schemes, check eligibility, and navigate the platform. Ask me
                    anything!
                  </p>
                  <div className="chat-widget__suggestions">
                    {QUICK_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="chat-widget__suggestion"
                        onClick={() => handleSend(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`chat-widget__msg chat-widget__msg--${msg.role}`}>
                <div className="chat-widget__msg-avatar">
                  {msg.role === 'bot' ? <Bot size={14} /> : 'U'}
                </div>
                <div>
                  <div className="chat-widget__bubble">
                    <p>{msg.content}</p>
                    {msg.role === 'bot' &&
                      msg.detectedLanguage &&
                      msg.detectedLanguage !== 'en' && (
                        <span className="chat-widget__lang-tag">
                          {LANG_NAMES[msg.detectedLanguage] ?? msg.detectedLanguage.toUpperCase()}
                        </span>
                      )}
                  </div>
                  {/* Action Chip */}
                  {msg.action && msg.action.type !== 'none' && (
                    <button
                      className="chat-widget__action-chip"
                      onClick={() => executeAction(msg.action!.type, msg.action!.payload ?? null)}
                    >
                      {getActionConfig(msg.action.type, msg.action.payload ?? null).icon}
                      {getActionConfig(msg.action.type, msg.action.payload ?? null).label}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="chat-widget__msg chat-widget__msg--bot">
                <div className="chat-widget__msg-avatar">
                  <Bot size={14} />
                </div>
                <div className="chat-widget__bubble">
                  <div className="chat-widget__typing">
                    <span className="chat-widget__typing-dot" />
                    <span className="chat-widget__typing-dot" />
                    <span className="chat-widget__typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-widget__input-area">
            <div className="chat-widget__input-row">
              <input
                ref={inputRef}
                className="chat-widget__input"
                placeholder={isListening ? '🎤 Listening...' : 'Ask anything about schemes…'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
                aria-label="Chat input"
                id="chat-widget-input"
              />
              <button
                className={`chat-widget__voice-btn${isListening ? ' chat-widget__voice-btn--listening' : ''}`}
                onClick={toggleVoice}
                title={isListening ? 'Stop listening' : 'Voice input'}
                aria-label="Toggle voice input"
                type="button"
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
              <button
                className="chat-widget__send-btn"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                type="button"
                id="chat-widget-send"
              >
                {loading ? <Loader2 size={15} className="chat-widget__spinner" /> : <Send size={15} />}
              </button>
            </div>
            <p className="chat-widget__disclaimer">
              AI guidance only · Not formal legal advice
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Action Button ── */}
      <button
        className={`chat-widget__fab${isOpen ? ' chat-widget__fab--open' : ''}`}
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close AI Copilot' : 'Open AI Copilot'}
        id="chat-widget-fab"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && hasNew && <span className="chat-widget__badge">1</span>}
        {!isOpen && (
          <span className="chat-widget__tooltip">AI Copilot</span>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
