import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader2, Eraser, Download, Table, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { aiService } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import AIFeatures from './AIFeatures';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Greetings! I'm Fletcher, your sophisticated AI assistant. How may I be of service today?", 
      isUser: false, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input;
    setInput("");
    setIsProcessing(true);
    setMessages(prev => [...prev, { text: userMessage, isUser: true, timestamp: Date.now() }]);

    try {
      const response = await aiService.processMessage(userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I do apologize, but I seem to be having trouble processing your request at the moment.",
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoice = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const clearChat = () => {
    setMessages([{ 
      text: "Chat history cleared. How may I be of assistance?", 
      isUser: false, 
      timestamp: Date.now() 
    }]);
  };

  const downloadChat = () => {
    const chatLog = messages
      .map(m => `${new Date(m.timestamp).toLocaleString()} - ${m.isUser ? 'User' : 'Fletcher'}: ${m.text}`)
      .join('\n\n');
    
    const blob = new Blob([chatLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFeatureSelect = (command: string) => {
    setInput(command);
    setShowAIFeatures(false);
  };

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-purple-500/30 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-purple-400 text-lg font-semibold">AI Interface</h2>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setShowAIFeatures(!showAIFeatures)}
            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
            title="AI Features"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showAIFeatures ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </motion.button>
          <motion.button
            onClick={clearChat}
            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
            title="Clear chat"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eraser className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={downloadChat}
            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
            title="Download chat history"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showAIFeatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <AIFeatures onFeatureSelect={handleFeatureSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-900/50 text-purple-100'
              }`}
            >
              <div className="text-xs opacity-50 mb-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              {message.isUser ? (
                message.text
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-center space-x-2">
        <motion.button 
          onClick={handleVoice}
          className={`p-2 ${isListening ? 'text-red-400 animate-pulse' : 'text-purple-400 hover:text-purple-300'} transition-colors`}
          disabled={isProcessing}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message or select an AI feature..."
          className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
          disabled={isProcessing}
        />
        <motion.button
          onClick={handleSend}
          disabled={isProcessing}
          className="p-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInterface;