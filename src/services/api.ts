import axios from 'axios';
import type { MovieResponse, MovieDetail } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await api.get('/movie/popular', { params: { page } });
  return response.data;
};

export const getTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await api.get('/movie/top_rated', { params: { page } });
  return response.data;
};

export const getMoviesByGenre = async (genreId: number, page = 1): Promise<MovieResponse> => {
  const response = await api.get('/discover/movie', {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page }
  });
  return response.data;
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  const response = await api.get('/search/movie', { params: { query, page } });
  return response.data;
};

// === API BARU: RECOMMENDATIONS ===
export const getMovieRecommendations = async (id: number): Promise<MovieResponse> => {
  const response = await api.get(`/movie/${id}/recommendations`);
  return response.data;
};

export const getGenres = async () => {
  const response = await api.get('/genre/movie/list');
  return response.data;
};

export const getUpcomingMovies = async () => { 
  const response = await api.get('/movie/upcoming');
  return response.data;
};

export const getMovieDetail = async (id: number): Promise<MovieDetail> => {
  const response = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return response.data;
};