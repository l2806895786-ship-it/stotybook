import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Volume2, Zap, Brain, MessageSquare, RotateCcw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  modelUsed?: string;
  timestamp: Date;
}

interface ChatBuddyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayTTS: (text: string) => void;
}

export const ChatBuddyDrawer: React.FC<ChatBuddyDrawerProps> = ({
  isOpen,
  onClose,
  onPlayTTS,
}) => {
  // Roles and model mapping:
  // - lumi: General companion -> gemini-3.5-flash
  // - sparky_guide: Complex mentor / grammar teacher -> gemini-3.1-pro-preview
  // - vocab_detective: Fast quick answers -> gemini-3.1-flash-lite
  const [selectedRole, setSelectedRole] = useState<'lumi' | 'sparky_guide' | 'vocab_detective'>('lumi');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      content: "Hello! I am Lumi the little green dragon! 🐉 Have you read my story? Ask me anything about my lost fire or our adventure with the rabbit and the bird!",
      modelUsed: 'gemini-3.5-flash',
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getRoleComplexity = (role: string): 'general' | 'complex' | 'fast' => {
    if (role === 'sparky_guide') return 'complex'; // gemini-3.1-pro-preview
    if (role === 'vocab_detective') return 'fast'; // gemini-3.1-flash-lite
    return 'general'; // gemini-3.5-flash
  };

  const getRoleModelBadge = (role: string) => {
    if (role === 'sparky_guide') {
      return {
        name: 'Sparky Guide',
        model: 'gemini-3.1-pro-preview',
        icon: Brain,
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        badge: 'Complex Reasoning (Pro)',
      };
    }
    if (role === 'vocab_detective') {
      return {
        name: 'Vocab Detective',
        model: 'gemini-3.1-flash-lite',
        icon: Zap,
        color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        badge: 'Fast Response (Lite)',
      };
    }
    return {
      name: 'Lumi Dragon',
      model: 'gemini-3.5-flash',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badge: 'Story Buddy (Flash)',
    };
  };

  const handleRoleChange = (newRole: 'lumi' | 'sparky_guide' | 'vocab_detective') => {
    setSelectedRole(newRole);
    let greeting = "";
    if (newRole === 'lumi') {
      greeting = "Roar! (A friendly tiny roar) 🐉 I'm Lumi! Let's talk about my warm flame, my fluffy rabbit friend, and the high mountain!";
    } else if (newRole === 'sparky_guide') {
      greeting = "Welcome, Grade 5 explorer! 🦉 I'm Sparky, your English Story Guide. I can explain sentence patterns, provide grammar tips, and dive deep into the story's meaning!";
    } else {
      greeting = "Vocab Detective on duty! ⚡ Ask me any English word or sentence pattern for lightning-fast meanings, Korean translations, and fun quizzes!";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'model',
        content: greeting,
        modelUsed: getRoleModelBadge(newRole).model,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setIsSending(true);

    try {
      const complexity = getRoleComplexity(selectedRole);

      // Format payload for server
      const payload = {
        messages: newHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        botRole: selectedRole,
        complexity,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Chat error (${response.status})`);
      }

      const data = await response.json();
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || "That's wonderful! Tell me more! 🐉",
        modelUsed: data.modelUsed || getRoleModelBadge(selectedRole).model,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `I heard you say "${text}"! Keep practicing your English! You are very brave just like Lumi! ⭐`,
        modelUsed: 'local-companion-fallback',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  const sampleQuestions = [
    "Lumi, how did it feel when you sneezed?",
    "Why is the rabbit such a good friend?",
    "Teach me how to say 'Have you seen my fire?'",
    "What does 'brave' mean in Korean?",
  ];

  if (!isOpen) return null;

  const currentBadge = getRoleModelBadge(selectedRole);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-115 bg-white shadow-2xl flex flex-col border-l-4 border-amber-300 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
            {selectedRole === 'lumi' ? '🐉' : selectedRole === 'sparky_guide' ? '🦉' : '⚡'}
          </div>
          <div>
            <h3 className="font-black text-base leading-tight">Story Buddy Chat</h3>
            <p className="text-[11px] font-semibold text-amber-100 flex items-center gap-1">
              <span>{currentBadge.name}</span>
              <span>•</span>
              <span className="font-mono">{currentBadge.model}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/20 active:scale-90 transition-colors text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Role Switcher with Model Specifications */}
      <div className="p-3 bg-amber-50/90 border-b border-amber-200">
        <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 mb-2 flex items-center justify-between">
          <span>Choose AI Buddy Role & Model</span>
          <span className="text-[10px] text-amber-700 font-mono">Gemini 3 Suite</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleRoleChange('lumi')}
            className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer ${
              selectedRole === 'lumi'
                ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-300'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
              <span>🐉</span> Lumi
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">3.5-flash</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('sparky_guide')}
            className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer ${
              selectedRole === 'sparky_guide'
                ? 'bg-purple-50 border-purple-500 shadow-sm ring-1 ring-purple-300'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-800">
              <span>🦉</span> Sparky
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">3.1-pro</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('vocab_detective')}
            className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer ${
              selectedRole === 'vocab_detective'
                ? 'bg-cyan-50 border-cyan-500 shadow-sm ring-1 ring-cyan-300'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-cyan-800">
              <span>⚡</span> Vocab Bot
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">3.1-lite</div>
          </button>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50/20">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-sm font-medium shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border-2 border-amber-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                    <span className="font-mono">{msg.modelUsed || 'Gemini'}</span>
                    <button
                      onClick={() => onPlayTTS(msg.content)}
                      className="p-1 rounded-md hover:bg-amber-100 hover:text-amber-800 text-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Read aloud with Gemini TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-amber-200 w-fit text-slate-500 text-xs font-bold animate-pulse">
            <Bot className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Thinking with {currentBadge.model}...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts for kids */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t border-amber-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message ${currentBadge.name}...`}
            disabled={isSending}
            className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-semibold outline-none text-slate-800 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !inputVal.trim()}
            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
