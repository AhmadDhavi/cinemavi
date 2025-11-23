import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-800 shadow-lg">
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] w-full animate-pulse bg-slate-700/50" />
      
      {/* Text Skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 bg-gradient-to-t from-slate-900 to-transparent pt-10">
        <div className="h-4 w-3/4 rounded bg-slate-600/50 animate-pulse" />
        <div className="flex justify-between">
          <div className="h-3 w-1/4 rounded bg-slate-600/50 animate-pulse" />
          <div className="h-3 w-1/4 rounded bg-slate-600/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
};