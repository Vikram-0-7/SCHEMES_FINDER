import { useState, useRef, useEffect } from 'react';
import { Sparkles, Building2, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { ChatMessage } from '../types';
import './LegalHelper.css';

const LegalHelper = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content:
        "Namaste! I am your Legal & Welfare Assistant. You can ask me about government schemes, eligibility, required documents, or your basic legal rights. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(userMessage.content);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legal-helper" id="legal-helper-page">
      {/* Header */}
      <section className="legal-helper__header" id="legal-helper-header">
        <div className="container">
          <div className="legal-helper__header-title">
            <Sparkles size={28} className="legal-helper__sparkle" />
            <h1 className="heading-lg">Legal & Welfare Assistant</h1>
          </div>
          <p className="legal-helper__subtitle">Ask questions in plain language.</p>
        </div>
      </section>

      <div className="container">
        <div className="legal-helper__chat-container" id="legal-helper-chat">
          {/* Messages */}
          <div className="legal-helper__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`legal-helper__message ${msg.role === 'user' ? 'legal-helper__message--user' : 'legal-helper__message--bot'}`}
                id={`msg-${msg.id}`}
              >
                {msg.role === 'bot' && (
                  <div className="legal-helper__avatar">
                    <Building2 size={18} />
                  </div>
                )}
                <div className="legal-helper__bubble">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="legal-helper__message legal-helper__message--bot">
                <div className="legal-helper__avatar">
                  <Building2 size={18} />
                </div>
                <div className="legal-helper__bubble legal-helper__typing">
                  <div className="legal-helper__dot" />
                  <div className="legal-helper__dot" />
                  <div className="legal-helper__dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="legal-helper__input-area" onSubmit={handleSend} id="legal-helper-form">
            <input
              type="text"
              className="legal-helper__input"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              id="legal-helper-input"
            />
            <button
              type="submit"
              className="legal-helper__send-btn"
              disabled={loading || !input.trim()}
              id="legal-helper-send"
            >
              {loading ? <Loader2 size={20} className="legal-helper__spinner" /> : <Send size={20} />}
            </button>
          </form>

          <p className="legal-helper__disclaimer">
            AI assistant provides general guidance, not formal legal advice. Always verify with official sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalHelper;
