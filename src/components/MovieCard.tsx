import React from 'react';
import { Star, Calendar, Plus, Check } from 'lucide-react'; 
import type { Movie } from '../types/movie';
import { useMovieStore } from '../store/useMovieStore';
import { RatingBadge } from './RatingBadge';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { openModal, toggleFavorite, favorites } = useMovieStore();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    toggleFavorite(movie);
  };

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div 
      onClick={() => openModal(movie.id)}
      className="group relative overflow-hidden rounded-xl bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/30 cursor-pointer"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Rating Badge (Tetap Muncul atau mau di-hide juga bisa) */}
      <RatingBadge 
        rating={movie.vote_average} 
        className="absolute top-2 left-2 z-20" 
      />

      {/* === TOMBOL WATCHLIST (HANYA MUNCUL SAAT HOVER) === */}
      <button
        onClick={handleFavoriteClick}
        // Logic CSS:
        // 1. opacity-0: Default transparan (hilang).
        // 2. group-hover:opacity-100: Kalau card di-hover, baru muncul.
        // 3. md:flex: Di Desktop (MD ke atas) pakai logic hover.
        // 4. hidden: Di Mobile (layar kecil), tombol ini HILANG TOTAL biar bersih.
        className={`absolute top-2 right-2 z-20 hidden md:flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-95 opacity-0 group-hover:opacity-100 ${
          isFavorite 
            ? 'bg-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
            : 'bg-black/60 text-white hover:bg-primary' 
        }`}
        title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        {isFavorite ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Plus className="h-4 w-4" strokeWidth={3} />
        )}
      </button>
      {/* ================================================= */}
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
          </div>
        </div>
        
        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
          {movie.overview}
        </p>
      </div>
    </div>
  );
};