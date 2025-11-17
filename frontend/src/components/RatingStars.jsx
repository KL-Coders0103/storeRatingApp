import React from 'react'
import { Star } from 'lucide-react'
import { motion as Motion } from 'framer-motion'

const RatingStars = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Motion.button
          key={star}
          type="button"
          whileHover={interactive ? { scale: 1.3 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => handleStarClick(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-400'
          }`}
          disabled={!interactive}
        >
          <Star 
            className={`${sizeClasses[size]} ${star <= rating ? 'fill-current' : ''}`} 
          />
        </Motion.button>
      ))}
    </div>
  )
}

export default RatingStars