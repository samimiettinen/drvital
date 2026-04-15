import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, AlertTriangle, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface HealthChatProps {
  title?: string;
  suggestedPrompts: string[];
  generateResponse: (question: string) => string;
  initialQuestion?: string | null;
  onClose?: () => void;
}

export function HealthChat({ title = 'Ask a question', suggestedPrompts, generateResponse, initialQuestion, onClose }: HealthChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialProcessed = useRef(false);

  // Handle initial question
  useEffect(() => {
    if (initialQuestion && !initialProcessed.current) {
      initialProcessed.current = true;
      sendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-medium">{title}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="max-h-[280px] overflow-y-auto space-y-2 mb-2">
        {messages.length === 0 && (
          <div className="space-y-1.5">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left text-[11px] px-2.5 py-2 rounded-lg bg-accent/50 text-accent-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`text-xs leading-relaxed rounded-lg px-2.5 py-2 ${
            msg.role === 'user'
              ? 'bg-primary/10 text-foreground ml-4'
              : 'bg-muted text-foreground mr-2'
          }`}>
            {msg.content.split('\n').map((line, j) => {
              if (line.startsWith('• ')) {
                return <p key={j} className="flex items-start gap-1 mt-0.5"><span className="mt-1 h-1 w-1 rounded-full bg-primary flex-shrink-0" /><span>{line.slice(2)}</span></p>;
              }
              if (line.startsWith('**') && line.includes(':**')) {
                const [label, ...rest] = line.split(':**');
                return <p key={j} className="mt-0.5"><span className="font-semibold">{label.replace(/\*\*/g, '')}:</span> {rest.join(':**').replace(/\*\*/g, '')}</p>;
              }
              if (line.trim() === '') return <br key={j} />;
              return <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>;
            })}
          </div>
        ))}

        {isTyping && (
          <div className="text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-2 mr-2 flex items-center gap-1.5">
            <span className="flex gap-0.5">
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask a question..."
          className="flex-1 text-xs bg-muted rounded-lg px-2.5 py-2 outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Send className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-start gap-1.5 mt-2 px-1">
        <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-tight">
          For educational purposes only. Not medical advice. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
