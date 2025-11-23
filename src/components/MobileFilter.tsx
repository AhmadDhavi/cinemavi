import React, { useState } from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import type { Genre } from '../types/movie';

interface MobileFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelect: (id: number | null) => void;
}

export const MobileFilter: React.FC<MobileFilterProps> = ({ genres, selectedGenre, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentGenreName = selectedGenre 
    ? genres.find((g) => g.id === selectedGenre)?.name 
    : "All Categories";

  const handleSelect = (id: number | null) => {
    onSelect(id);
    setIsOpen(false); 
  };

  return (
    <div className="relative md:hidden w-full px-4 mb-6 z-40">
      {/* Tombol Utama */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-700 p-3.5 text-sm font-medium transition-all ${
          isOpen ? 'bg-slate-800 text-white ring-2 ring-primary/50' : 'bg-slate-800/50 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Layers className={`h-4 w-4 ${selectedGenre ? 'text-primary' : 'text-slate-400'}`} />
          <span className={selectedGenre ? 'text-white' : ''}>{currentGenreName}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown List Items */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleSelect(null)}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                selectedGenre === null 
                  ? 'bg-primary text-white font-medium' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              All Categories
            </button>
            
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleSelect(genre.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedGenre === genre.id 
                    ? 'bg-primary text-white font-medium' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Backdrop Invisible buat close pas klik luar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};