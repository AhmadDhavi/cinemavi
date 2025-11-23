import React from 'react';
import { clsx } from 'clsx'; 

interface RatingBadgeProps {
  rating: number;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, className }) => {
  const colorClass = 
    rating >= 7 ? 'border-green-500 text-green-400 bg-green-500/10' :
    rating >= 5 ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
    'border-red-500 text-red-400 bg-red-500/10';

  return (
    <div className={clsx(
      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold backdrop-blur-md",
      colorClass,
      className
    )}>
      {rating.toFixed(1)}
    </div>
  );
};