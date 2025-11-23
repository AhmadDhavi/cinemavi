import React, { useEffect, useState, useRef } from 'react'; // Tambah useRef
import { X, Star, Plus, Check } from 'lucide-react';
import { useMovieStore } from '../store/useMovieStore';
import { getMovieDetail, getMovieRecommendations } from '../services/api';
import type { MovieDetail, Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import ColorThief from 'colorthief';


export const MovieModal: React.FC = () => {
    const { isOpen, closeModal, selectedMovieId, favorites, toggleFavorite } = useMovieStore();
    
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [dominantColor, setDominantColor] = useState<string>('#6366f1'); 
    const imgRef = useRef<HTMLImageElement>(null); 

    const isFavorite = movie ? favorites.some((fav) => fav.id === movie.id) : false;

    useEffect(() => {
        if (isOpen && selectedMovieId) {
            fetchAllData(selectedMovieId);
            document.body.style.overflow = 'hidden';
        } else {
            setMovie(null);
            setRecommendations([]);
            setDominantColor('#6366f1'); 
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, selectedMovieId]);

    const fetchAllData = async (id: number) => {
        setLoading(true);
        try {
            const [detailData, recommendData] = await Promise.all([
                getMovieDetail(id),
                getMovieRecommendations(id)
            ]);
            setMovie(detailData);
            setRecommendations(recommendData.results);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // === HOOK BARU: EKSTRAKSI WARNA DENGAN COLOR THIEF ===
    useEffect(() => {
        if (!movie?.poster_path || !imgRef.current) return;
        
        const imgElement = imgRef.current;

        const handleImageLoad = () => {
            try {
                const colorThief = new ColorThief();
                // Ambil 3 warna paling dominan (palette)
                const palette = colorThief.getPalette(imgElement, 3); 
                
                // Ambil warna pertama (yang paling dominan) dan ubah ke format HEX
                const [r, g, b] = palette[0];
                const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

                setDominantColor(hexColor);
            } catch (e) {
                console.error("ColorThief failed, likely due to CORS policy or unsupported image.", e);
                // Fallback ke default color
                setDominantColor('#6366f1'); 
            }
        };

        // Tambahkan event listener untuk memastikan gambar sudah di-render & di-load
        if (imgElement.complete) {
            handleImageLoad();
        } else {
            imgElement.addEventListener('load', handleImageLoad);
        }
        
        // Cleanup listener saat komponen unmount
        return () => {
            imgElement.removeEventListener('load', handleImageLoad);
        };
    }, [movie]);
    // =======================================================


    if (!isOpen) return null;

    const trailer = movie?.videos.results.find(
        (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
            
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
                onClick={closeModal}
            />

            {/* Container Modal dengan Dynamic Border Color */}
            <div 
                className="relative w-full bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[90vh] rounded-t-2xl animate-in slide-in-from-bottom-full duration-300 md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-2xl md:animate-in md:zoom-in-95 transition-colors duration-500"
                style={{ 
                    border: `1px solid ${dominantColor}40`, // 40 = Opacity
                    boxShadow: `0 25px 50px -12px ${dominantColor}20`
                }}
            >
                
                {/* === MAGIC: COLOR THIEF (Hidden Image) === */}
                {/* Gambar ini disembunyikan dan hanya dipakai ColorThief. Ref-nya dihubungkan ke Hook */}
                {movie && (
                    <img 
                        ref={imgRef} 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                        alt="color-thief-source" 
                        style={{ display: 'none' }} 
                        crossOrigin="anonymous" 
                    />
                )}

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-[60]">
                   <button 
                       onClick={closeModal}
                       className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md border border-white/10 transition-all hover:rotate-90 active:scale-95 shadow-lg"
                       onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dominantColor}
                       onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                   >
                       <X className="h-6 w-6" />
                   </button>
                </div>

                <div className="overflow-y-auto scrollbar-hide h-full">
                    {loading ? (
                        <div className="flex h-[50vh] items-center justify-center">
                            {/* Spinner warnanya dinamis */}
                            <div 
                                className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                                style={{ borderColor: dominantColor, borderTopColor: 'transparent' }}
                            ></div>
                        </div>
                    ) : movie ? (
                        <div>
                            {/* Hero / Trailer */}
                            <div className="relative aspect-video w-full bg-black md:aspect-[2.5/1]">
                                {trailer ? (
                                    <iframe
                                        className="h-full w-full"
                                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&rel=0&showinfo=0`}
                                        title={movie.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                        alt={movie.title}
                                        className="h-full w-full object-cover opacity-60"
                                    />
                                )}
                                {/* Dynamic Gradient Fade */}
                                <div 
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(to top, #0f172a 0%, ${dominantColor}20 50%, transparent 100%)`
                                    }} 
                                />
                            </div>

                            <div className="p-6 md:p-10 space-y-8 bg-slate-900 relative">
                                {/* Decorative Glow di background */}
                                <div 
                                    className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
                                    style={{ backgroundColor: dominantColor }}
                                />

                                {/* Header Info */}
                                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                    <div 
                                        className="hidden md:block w-32 shrink-0 rounded-lg overflow-hidden shadow-lg -mt-20 z-10 relative transition-all duration-500"
                                        style={{ border: `2px solid ${dominantColor}60` }}
                                    >
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                            {movie.title}
                                        </h2>
                                        
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                            {/* Dynamic Rating Badge Color */}
                                            <div 
                                                className="flex items-center gap-1 px-2 py-1 rounded text-white font-bold"
                                                style={{ backgroundColor: dominantColor }}
                                            >
                                                <Star className="h-3 w-3 fill-white" />
                                                <span>{movie.vote_average.toFixed(1)}</span>
                                            </div>
                                            <span className="hidden md:inline">•</span>
                                            <span>{movie.runtime} min</span>
                                            <span className="hidden md:inline">•</span>
                                            <span>{movie.release_date.split('-')[0]}</span>
                                        </div>

                                        {/* Dynamic Action Button */}
                                        <button
                                            onClick={() => toggleFavorite(movie)}
                                            className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-95 text-white shadow-lg"
                                            style={{ 
                                                backgroundColor: isFavorite ? '#1e293b' : dominantColor, // Slate-800 kalau saved, Dominant kalau belum
                                                border: isFavorite ? '1px solid #334155' : 'none',
                                                boxShadow: isFavorite ? 'none' : `0 10px 15px -3px ${dominantColor}50`
                                            }}
                                        >
                                            {isFavorite ? (
                                                <><Check className="h-5 w-5" /> Saved</>
                                            ) : (
                                                <><Plus className="h-5 w-5" /> Add to Watchlist</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="grid md:grid-cols-[2fr_1fr] gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white">Storyline</h3>
                                        <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {movie.genres.map((g) => (
                                                <span key={g.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 border border-slate-700">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Top Cast</h3>
                                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                                            {movie.credits.cast.slice(0, 4).map((actor) => (
                                                <div key={actor.id} className="flex items-center gap-3 min-w-[140px]">
                                                    <img
                                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/50'}
                                                        alt={actor.name}
                                                        className="h-10 w-10 rounded-full object-cover border border-slate-700"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-white line-clamp-1">{actor.name}</p>
                                                        <p className="text-xs text-slate-500 line-clamp-1">{actor.character}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                {recommendations.length > 0 && (
                                    <div className="pt-6 border-t border-slate-800">
                                        <h3 className="text-xl font-bold text-white mb-4">You Might Also Like</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {recommendations.slice(0, 4).map((recMovie) => (
                                                <MovieCard key={recMovie.id} movie={recMovie} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};