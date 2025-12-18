import React, { useEffect, useState, useRef } from 'react';
import { Article } from '../types';
import { getArticleContent, getChatResponse, ChatMessage } from '../services/geminiService';
import { X, Sparkles, Loader2, MessageCircle, BookOpen, Send, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

type Tab = 'read' | 'chat';

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('read');
  const [content, setContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      setLoadingContent(true);
      const text = await getArticleContent(article.fullPrompt);
      if (isMounted) {
        setContent(text);
        setLoadingContent(false);
      }
    };
    fetchContent();
    return () => { isMounted = false; };
  }, [article]);

  useEffect(() => {
    // Scroll to bottom of chat when history updates
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoadingChat(true);

    const responseText = await getChatResponse(article.fullPrompt, userMsg.text, chatHistory);
    
    setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    setLoadingChat(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col relative ring-1 ring-white/50">
        
        {/* Header Image & Title */}
        <div className="h-48 md:h-64 w-full relative shrink-0">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
             <div className="flex items-center gap-2 text-pink-300 text-sm font-bold uppercase tracking-widest mb-2">
                <span className="bg-pink-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-400/30">{article.category}</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-serif text-white font-bold leading-tight drop-shadow-lg">{article.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full transition-all hover:scale-110 border border-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 px-8 pt-4 gap-6 bg-white sticky top-0 z-10">
           <button 
             onClick={() => setActiveTab('read')}
             className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'read' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             <BookOpen size={18} />
             Read Article
           </button>
           <button 
             onClick={() => setActiveTab('chat')}
             className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'chat' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             <MessageCircle size={18} />
             Ask Dr. AI
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 p-6 md:p-10">
          
          {/* TAB: READ ARTICLE */}
          {activeTab === 'read' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl mx-auto">
              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-pink-400">
                  <div className="p-4 bg-pink-50 rounded-full animate-spin">
                    <Loader2 size={32} />
                  </div>
                  <p className="font-serif italic text-lg text-gray-500">Curating health insights for you...</p>
                </div>
              ) : (
                <article className="prose prose-pink prose-lg max-w-none prose-headings:font-serif prose-headings:text-pink-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-pink-800">
                   <div className="flex items-center gap-2 text-pink-600 mb-8 bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-sm">
                      <Sparkles size={20} className="shrink-0" />
                      <span className="text-sm font-medium">This content is generated by AI based on verified topics. Always consult a professional for medical advice.</span>
                   </div>
                   <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-white">
                      <ReactMarkdown>{content}</ReactMarkdown>
                   </div>
                </article>
              )}
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Messages Area */}
              <div className="flex-1 space-y-6 mb-4 pr-2">
                {chatHistory.length === 0 && (
                   <div className="text-center py-20 opacity-60">
                      <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                        <MessageCircle size={32} />
                      </div>
                      <p className="text-lg font-serif text-gray-700">Have questions about {article.title}?</p>
                      <p className="text-sm text-gray-500">Ask anything! I'm here to help explain further.</p>
                   </div>
                )}
                
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-pink-100 text-pink-600'}`}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {loadingChat && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <Bot size={20} />
                    </div>
                     <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></span>
                     </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="relative mt-auto">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="w-full bg-white border border-gray-200 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-lg text-gray-700 placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || loadingChat}
                  className="absolute right-2 top-2 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} />
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Footer actions */}
        {activeTab === 'read' && (
          <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center px-8">
            <span className="text-xs text-gray-400 italic">Information provided for educational purposes.</span>
            <button 
              onClick={() => setActiveTab('chat')}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full font-medium transition-colors text-sm flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              <MessageCircle size={16} />
              Have Questions? Ask AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
