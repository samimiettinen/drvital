import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, AlertTriangle } from 'lucide-react';
import type { Biomarker } from '@/data/biomarkerData';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  "What can I do to improve this result?",
  "What happens if this stays high over time?",
  "What are the health recommendations?",
  "How does this relate to my other conditions?",
];

// Mock AI responses based on biomarker context
function generateResponse(question: string, marker: Biomarker): string {
  const q = question.toLowerCase();

  if (q.includes('improve') || q.includes('recommendation')) {
    const tips = marker.lifestyleFactors.slice(0, 3).join(', ');
    if (marker.status === 'normal') {
      return `Your ${marker.plainName} is currently in a healthy range, which is great. To maintain this:\n\n• ${marker.lifestyleFactors.slice(0, 3).join('\n• ')}\n\nKeep doing what you're doing — consistency matters more than perfection.`;
    }
    return `Here are some everyday factors that may help bring your ${marker.plainName} closer to the target range:\n\n• ${marker.lifestyleFactors.join('\n• ')}\n\nSmall, consistent changes tend to be more sustainable than dramatic shifts. ${marker.clinicalContext ? '\n\n' + marker.clinicalContext : ''}`;
  }

  if (q.includes('high over time') || q.includes('stays high') || q.includes('continues') || q.includes('happen')) {
    if (marker.status === 'normal') {
      return `Your ${marker.plainName} is currently within the normal range, so there's no immediate concern about long-term effects at this level.\n\n${marker.whyItMatters}\n\nContinued monitoring through regular check-ups is the best approach to catch any changes early.`;
    }
    return `If ${marker.plainName} remains elevated over a longer period, it could contribute to increased health risks.\n\n${marker.whyItMatters}\n\nThe good news is that ${marker.previousValue ? `your value has already changed from ${marker.previousValue} to ${marker.value} ${marker.unit}, showing that it responds to intervention.` : 'many of the factors that influence this marker are within your control.'}\n\nThis is worth discussing with your doctor at your next visit to set a clear target and timeline.`;
  }

  if (q.includes('relate') || q.includes('other condition') || q.includes('connection')) {
    return `Your ${marker.plainName} (${marker.medicalName}) is part of the ${marker.bodySystem} system.\n\n${marker.clinicalContext || marker.explanation}\n\nHealth markers often influence each other — for example, sleep quality, stress, and exercise can affect multiple systems simultaneously. Your doctor can help you understand how this fits into your overall health picture.`;
  }

  // Generic response
  return `Regarding your ${marker.plainName} (${marker.medicalName}):\n\n**Current value:** ${marker.value} ${marker.unit}\n**Reference range:** ${marker.referenceRange.low}–${marker.referenceRange.high} ${marker.unit}\n\n${marker.explanation}\n\n${marker.whyItMatters}\n\nWould you like to know more about specific lifestyle factors or how this relates to your other health data?`;
}

export function ResultChat({ marker }: { marker: Biomarker }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset chat when marker changes
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [marker.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(text, marker);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs font-medium">Ask about this result</p>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="max-h-[240px] overflow-y-auto space-y-2 mb-2">
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

      {/* Input */}
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

      {/* Disclaimer */}
      <div className="flex items-start gap-1.5 mt-2 px-1">
        <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-tight">
          For educational purposes only. Not medical advice. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}
