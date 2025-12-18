import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Card } from './components/Card';
import { ArticleModal } from './components/ArticleModal';
import { PeriodTracker } from './components/PeriodTracker';
import { LibraryPage } from './components/LibraryPage';
import { ViewState, Article, UserProfile } from './types';
import { MAIN_CATEGORIES, FEATURE_ARTICLES, PERIOD_DETAILS } from './constants';
import { getMotivationalQuote } from './services/geminiService';
import { authService } from './services/storageService';
import { User, Quote, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    handleLoadQuote();
    // Check for existing session
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLoadQuote = async () => {
    const q = await getMotivationalQuote();
    setQuote(q);
  };

  const handleNavigate = (view: ViewState) => {
    // Protected Routes
    if (view === ViewState.TRACKER && !currentUser) {
      setViewState(ViewState.LOGIN);
      return;
    }
    setViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
  };


  // --- AUTH HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const user = authService.login(usernameInput);
    if (user) {
      setCurrentUser(user);
      setAuthError('');
      handleNavigate(ViewState.HOME);
    } else {
      setAuthError('User not found. Please sign up first.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const user = authService.signup(usernameInput);
    if (user) {
      setCurrentUser(user);
      setAuthError('');
      handleNavigate(ViewState.HOME);
    } else {
      setAuthError('Username already taken.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setViewState(ViewState.HOME);
  };

  // --- RENDER AUTH SCREENS ---
  if (viewState === ViewState.LOGIN || viewState === ViewState.SIGNUP) {
    const isLogin = viewState === ViewState.LOGIN;
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col">
        <Header
          onNavigate={handleNavigate}
          isLoggedIn={!!currentUser}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background decor for auth */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

          <div className="relative z-10 text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-serif text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Join SHUSH!'}
            </h2>
            <p className="text-gray-500 font-light">Your personal health companion</p>
          </div>

          <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center text-pink-500 shadow-inner">
              <Lock size={28} />
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
                {authError}
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-800"
                  placeholder="Enter your username"
                />
              </div>

              <button type="submit" className="w-full bg-brand-dark-pink hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2 group">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setAuthError('');
                  setViewState(isLogin ? ViewState.SIGNUP : ViewState.LOGIN);
                }}
                className="text-sm text-gray-500 hover:text-pink-600 transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-bold underline decoration-pink-300 underline-offset-2">{isLogin ? "Sign up" : "Login"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header
        onNavigate={handleNavigate}
        isLoggedIn={!!currentUser}
        onLogout={handleLogout}
      />

      <main>
        {viewState === ViewState.LIBRARY ? (
          <LibraryPage onReadMore={handleReadMore} />
        ) : viewState === ViewState.TRACKER && currentUser ? (
          <PeriodTracker
            user={currentUser}
            onUpdateUser={() => setCurrentUser(authService.getCurrentUser())}
          />
        ) : (
          <>
            <Hero />

            {/* Quote Banner - Styled with transparency */}
            {quote && (
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-6 px-4 text-center relative overflow-hidden shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 relative z-10">
                  <Quote className="shrink-0 rotate-180 opacity-60" size={20} />
                  <p className="text-lg md:text-xl font-serif italic tracking-wide">{quote}</p>
                  <Quote className="shrink-0 opacity-60" size={20} />
                </div>
              </div>
            )}

            {/* Main Categories */}
            <section id="main-content" className="py-24 px-4 max-w-7xl mx-auto">
              <div className="flex flex-col items-center mb-16 text-center">
                <span className="text-brand-dark-pink font-bold uppercase tracking-widest text-xs mb-3">Explore Topics</span>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-800">Your Health, Your Way</h2>
                <div className="w-24 h-1 bg-pink-200 mt-6 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {MAIN_CATEGORIES.map((article, idx) => (
                  <div key={article.id} className={`animate-in fade-in slide-in-from-bottom-8 duration-700 delay-${idx * 100}`}>
                    <Card article={article} onReadMore={handleReadMore} variant="circle" />
                  </div>
                ))}
              </div>
            </section>

            {/* Feature Section: Closer Look */}
            <section className="py-24 bg-pink-50/50 relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>

              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                  <div className="inline-flex items-center gap-2 text-pink-500 bg-pink-100/50 px-4 py-1 rounded-full mb-4">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Deep Dive</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Take a Closer Look</h2>
                  <p className="text-gray-500 text-lg max-w-2xl mx-auto">Understanding your mental health and sexuality is essential for a balanced life.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                  {FEATURE_ARTICLES.map(article => (
                    <div key={article.id} className="flex flex-col items-start group bg-white p-6 rounded-[2rem] shadow-xl shadow-pink-100/40 hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-300">
                      <div className="w-full h-64 overflow-hidden rounded-2xl mb-8 relative">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-3xl font-serif text-gray-800 mb-4 group-hover:text-pink-600 transition-colors">{article.title}</h3>
                      <p className="text-gray-500 leading-relaxed mb-8 border-l-2 border-pink-100 pl-4">{article.description}</p>
                      <button
                        onClick={() => handleReadMore(article)}
                        className="mt-auto px-8 py-3 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl font-semibold transition-colors w-full md:w-auto"
                      >
                        Read More
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Period Details Section */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
              <div className="text-center mb-16 bg-gradient-to-br from-pink-50 to-white border border-pink-100 py-12 rounded-[3rem] mx-auto max-w-4xl shadow-lg shadow-pink-50/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>

                <h2 className="text-4xl font-serif text-gray-800 mb-2 relative z-10">Period</h2>
                <p className="text-gray-500 relative z-10">Everything you need to know about your cycle</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {PERIOD_DETAILS.map(article => (
                  <Card key={article.id} article={article} onReadMore={handleReadMore} variant="square" />
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-20 pb-12 border-t border-pink-50">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h3 className="font-serif text-2xl font-bold text-pink-800 mb-6">SHUSH!</h3>
                <div className="flex justify-center space-x-8 mb-8 text-gray-500">
                  <a href="#" className="hover:text-pink-600 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-pink-600 transition-colors">Terms</a>
                  <a href="#" className="hover:text-pink-600 transition-colors">Support</a>
                  <a href="#" className="hover:text-pink-600 transition-colors">Instagram</a>
                </div>
                <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} SHUSH! Women's Health Portal. All rights reserved.</p>
              </div>
            </footer>
          </>
        )}

        {/* Article Modal */}
        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </main>
    </div>
  );
}