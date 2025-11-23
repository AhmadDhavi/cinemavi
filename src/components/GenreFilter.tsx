import React from 'react';
import type { Genre } from '../types/movie';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelect: (id: number | null) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({ genres, selectedGenre, onSelect }) => {
  return (
    <div className="sticky top-16 z-40 w-full border-b border-white/5 bg-dark/95 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide mask-gradient-right">
          
          {/* Tombol "All" */}
          <button
            onClick={() => onSelect(null)}
            className={`flex-shrink-0 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 ${
              selectedGenre === null
                ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-dark'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All
          </button>
          
          {/* Mapping Genre */}
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onSelect(genre.id)}
              className={`flex-shrink-0 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 ${
                selectedGenre === genre.id
                  ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-dark'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Decorative gradient fade on the right (Optional visuals) */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-dark to-transparent md:hidden" />
    </div>
  );
};