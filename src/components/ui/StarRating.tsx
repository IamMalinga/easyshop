import { FiStar } from 'react-icons/fi';

interface Props {
  rating: number;
  numReviews?: number;
  size?: number;
}

export function StarRating({ rating, numReviews, size = 16 }: Props) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <FiStar
            key={s}
            size={size}
            className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-sm text-gray-500">
          {rating.toFixed(1)} ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}