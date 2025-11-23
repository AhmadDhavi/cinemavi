import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

export const MovieSection: React.FC<MovieSectionProps> = ({ title, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const scrollAmount = direction === 'left' ? -scrollElement.clientWidth : scrollElement.clientWidth;
      scrollElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="py-8 relative group/section">
      <h2 className="mb-4 text-2xl font-bold text-white px-4 border-l-4 border-primary ml-4">
        {title}
      </h2>
      
      {/* Scroll Buttons (Muncul pas hover section) */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-xl bg-black/60 p-3 text-white opacity-0 transition-opacity hover:bg-primary group-hover/section:opacity-100 hidden md:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-xl bg-black/60 p-3 text-white opacity-0 transition-opacity hover:bg-primary group-hover/section:opacity-100 hidden md:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Horizontal List */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[160px] md:min-w-[200px] snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};