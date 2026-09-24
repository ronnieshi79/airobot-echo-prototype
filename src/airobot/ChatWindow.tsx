import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isThinking: boolean;
  isDarkMode: boolean;
  onSendMessage: (content: string) => void;
  suggestions: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isThinking,
  isDarkMode,
  onSendMessage,
  suggestions,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
              msg.role === 'user'
                ? 'bg-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-500/20'
                : (isDarkMode ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10' : 'bg-white text-slate-700 rounded-tl-none border border-black/5 shadow-sm')
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-2xl rounded-tl-none border flex gap-1 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'
            }`}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((tag, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSendMessage(tag)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider border transition-all ${
              isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-black/5 text-slate-500 hover:text-slate-800'
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="给 AETHER 发消息..."
          className={`w-full py-4 pl-6 pr-14 rounded-3xl text-sm font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
            isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-100 border-black/5 text-slate-800 placeholder:text-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-90"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
