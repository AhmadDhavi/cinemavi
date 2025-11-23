import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getPopularMovies, 
  getGenres, 
  searchMovies, 
  getMoviesByGenre
} from './services/api';
import type { Movie } from './types/movie';
import { useMovieStore } from './store/useMovieStore';

// Components
import { Navbar } from './components/Navbar';
import { MovieModal } from './components/MovieModal';
import { GenreFilter } from './components/GenreFilter'; 
import { MovieCard } from './components/MovieCard';
import { SkeletonCard } from './components/SkeletonCard'; 
import { Heart, Clapperboard } from 'lucide-react';
import type { Genre } from './types/movie';

function App() {
  const { favorites } = useMovieStore();

  // Data States
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  // UI & Filter States
  const [loading, setLoading] = useState(false); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'favorites'>('discover');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 

  // Ref untuk observer (Infinite Scroll trigger)
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Element terakhir yang diamati
  const lastMovieElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && activeTab === 'discover') {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, activeTab]);

  useEffect(() => {
    getGenres().then(res => setGenres(res.genres));
  }, []);

  useEffect(() => {
    if (activeTab === 'favorites') return;
    
    setMovies([]); 
    setPage(1);    
    setHasMore(true);
    setLoading(true); 

    const fetchFirstPage = async () => {
      try {
        let data;
        if (searchQuery) {
          data = await searchMovies(searchQuery, 1);
        } else if (selectedGenre) {
          data = await getMoviesByGenre(selectedGenre, 1);
        } else {
          data = await getPopularMovies(1);
        }
        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchFirstPage, 500);
    return () => clearTimeout(timeout);

  }, [searchQuery, selectedGenre, activeTab]);


  useEffect(() => {
    if (page === 1) return; 
    if (activeTab === 'favorites') return;

    const fetchNextPage = async () => {
      setLoadingMore(true);
      try {
        let data;
        if (searchQuery) {
          data = await searchMovies(searchQuery, page);
        } else if (selectedGenre) {
          data = await getMoviesByGenre(selectedGenre, page);
        } else {
          data = await getPopularMovies(page);
        }

        setMovies(prev => [...prev, ...data.results]);
        
        if (data.results.length === 0) setHasMore(false);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchNextPage();
  }, [activeTab, page, searchQuery, selectedGenre]); 

  return (
    <div className="min-h-screen bg-dark font-sans text-white pb-20">
      
      <Navbar 
        onSearch={setSearchQuery} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />
      
      <div className="h-16"></div> 

      {/* Mobile Filter */}
      {!searchQuery && activeTab === 'discover' && (
        <div className="md:hidden">
           <GenreFilter 
              genres={genres} 
              selectedGenre={selectedGenre} 
              onSelect={setSelectedGenre} 
            />
        </div>
      )}

      <main className="container mx-auto px-4 space-y-8 mt-6">
        
        {/* HEADER TITLE */}
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold flex items-center gap-2">
              {activeTab === 'favorites' ? (
                <> <Heart className="text-red-500 fill-red-500" /> My Watchlist </>
              ) : searchQuery ? (
                <> 🔍 Search: "{searchQuery}" </>
              ) : selectedGenre ? (
                <> 🏷️ {genres.find(g => g.id === selectedGenre)?.name} Movies </>
              ) : (
                <> 🔥 Popular Movies </>
              )}
           </h2>
        </div>

        {/* === CONTENT GRID === */}
        {activeTab === 'favorites' ? (
          // FAVORITES VIEW
          favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-in fade-in">
               {favorites.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Your watchlist is empty.</p>
            </div>
          )
        ) : (
          // DISCOVER VIEW (Infinite Scroll)
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {/* Render Movies */}
              {movies.map((movie, index) => {
                if (movies.length === index + 1) {
                  return (
                    <div ref={lastMovieElementRef} key={movie.id}>
                       <MovieCard movie={movie} />
                    </div>
                  );
                } else {
                  return <MovieCard key={movie.id} movie={movie} />;
                }
              })}
              
              {/* Skeleton Loading (Muncul pas awal load) */}
              {loading && [...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              
              {/* Skeleton Loading (Muncul pas load page selanjutnya) */}
              {loadingMore && [...Array(5)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>

            {/* Empty State */}
            {!loading && movies.length === 0 && (
               <div className="text-center py-20 text-slate-500">
                  <Clapperboard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No movies found.</p>
               </div>
            )}
          </>
        )}
      </main>

      <MovieModal />
    </div>
  );
}

export default App;