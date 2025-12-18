import React from 'react';
import { ViewState } from '../types';
import { authService } from '../services/storageService';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, isLoggedIn, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/60 border-b border-pink-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate(ViewState.HOME)}>
             <span className="font-serif text-2xl font-bold text-pink-800 tracking-wide">SHUSH!</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => onNavigate(ViewState.HOME)}
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Home
            </button>
            
            <button 
              onClick={() => onNavigate(ViewState.TRACKER)}
              className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
            >
              Period Tracker
            </button>

            <div className="relative group">
              <button className="text-gray-700 hover:text-pink-600 font-medium flex items-center gap-1 transition-colors">
                Health Library
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* Dropdown Mock */}
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <button 
                  onClick={() => onNavigate(ViewState.LIBRARY)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                >
                  Browse Articles
                </button>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">Consultation</a>
              </div>
            </div>
            
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="text-pink-600 border border-pink-200 hover:bg-pink-50 px-5 py-1.5 rounded-full font-medium transition-all"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => onNavigate(ViewState.LOGIN)}
                className="text-white bg-pink-400 hover:bg-pink-500 px-5 py-1.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-pink-600 focus:outline-none" onClick={() => onNavigate(ViewState.TRACKER)}>
              {/* Simple mobile action for now */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};