import React, { useState, useEffect } from 'react';
import { Search, Film, Heart, Menu, X, Home, ChevronDown } from 'lucide-react';
import { useMovieStore } from '../store/useMovieStore';
import type { Genre } from '../types/movie';

interface NavbarProps {
  onSearch: (query: string) => void;
  activeTab: 'discover' | 'favorites';
  setActiveTab: (tab: 'discover' | 'favorites') => void;
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (id: number | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  activeTab, 
  setActiveTab,
  genres,
  selectedGenre,
  onSelectGenre
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false); 
  const { favorites } = useMovieStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || isGenreDropdownOpen
          ? 'bg-dark/95 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. LOGO */}
          <div 
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => {
              setActiveTab('discover');
              onSelectGenre(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="bg-primary/20 p-2 rounded-lg">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide hidden sm:block">
              Cine<span className="text-primary">Mavi</span>
            </span>
          </div>

          {/* 2. DESKTOP NAVIGATION (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => {
                setActiveTab('discover');
                onSelectGenre(null);
              }}
              className={`text-sm font-medium hover:text-white transition-colors ${
                 activeTab === 'discover' && selectedGenre === null ? 'text-white' : 'text-slate-400'
              }`}
            >
              Home
            </button>

            {/* Desktop Genre Dropdown */}
            <div className="relative group">
              <button 
                className={`flex items-center gap-1 text-sm font-medium hover:text-white transition-colors ${
                  selectedGenre ? 'text-primary' : 'text-slate-400'
                }`}
                onMouseEnter={() => setIsGenreDropdownOpen(true)}
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] rounded-xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 origin-top ${
                  isGenreDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                }`}
                onMouseLeave={() => setIsGenreDropdownOpen(false)}
              >
                <div className="grid grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        onSelectGenre(genre.id);
                        setActiveTab('discover');
                        setIsGenreDropdownOpen(false);
                      }}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedGenre === genre.id 
                          ? 'bg-primary text-white' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                activeTab === 'favorites' ? 'text-primary' : 'text-slate-400 hover:text-white'
              }`}
            >
              Watchlist
              {favorites.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* 3. SEARCH & MOBILE TOGGLE */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative w-64">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <input
                 type="text"
                 placeholder="Search..."
                 onChange={(e) => onSearch(e.target.value)}
                 className="w-full rounded-full bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary focus:bg-slate-800 outline-none transition-all"
               />
            </div>

            {/* TOMBOL HAMBURGER (Hanya muncul di Mobile) */}
            <button 
              className="md:hidden text-white p-2 z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. MOBILE MENU DROPDOWN (YANG HILANG KEMARIN) */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col p-4 pt-20 space-y-4">
            {/* Search di Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-800 p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Links */}
            <button
              onClick={() => {
                setActiveTab('discover');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl p-4 font-semibold transition-colors ${
                activeTab === 'discover' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Home className="h-5 w-5" />
              Home
            </button>

            <button
              onClick={() => {
                setActiveTab('favorites');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl p-4 font-semibold transition-colors ${
                activeTab === 'favorites' 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Heart className="h-5 w-5" />
              My Watchlist
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {favorites.length}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
