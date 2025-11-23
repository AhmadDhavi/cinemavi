import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 
import type { Movie } from '../types/movie';

interface MovieStore {
  selectedMovieId: number | null;
  isOpen: boolean;
  favorites: Movie[]; 
  openModal: (id: number) => void;
  closeModal: () => void;
  toggleFavorite: (movie: Movie) => void; 
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set) => ({
      selectedMovieId: null,
      isOpen: false,
      favorites: [],

      openModal: (id) => set({ isOpen: true, selectedMovieId: id }),
      closeModal: () => set({ isOpen: false, selectedMovieId: null }),

      toggleFavorite: (movie) =>
        set((state) => {
          const isExist = state.favorites.some((fav) => fav.id === movie.id);
          if (isExist) {
            return { favorites: state.favorites.filter((fav) => fav.id !== movie.id) };
          } else {
            return { favorites: [...state.favorites, movie] };
          }
        }),
    }),
    {
      name: 'cinevibe-storage', 
      partialize: (state) => ({ favorites: state.favorites }), 
    }
  )
);