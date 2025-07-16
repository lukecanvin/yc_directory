import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { VoteDisplayProps } from '@/lib/types';

const VoteDisplay = ({ thumbsUp, thumbsDown }: VoteDisplayProps) => {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* Thumbs Up Display */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThumbsUp 
          className="size-4 sm:size-5 text-green-600 fill-green-100" 
          aria-hidden="true"
        />
        <span 
          className="text-16-medium text-black-100"
          aria-label={`${thumbsUp} thumbs up votes`}
        >
          {thumbsUp}
        </span>
      </div>

      {/* Thumbs Down Display */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThumbsDown 
          className="size-4 sm:size-5 text-red-600 fill-red-100" 
          aria-hidden="true"
        />
        <span 
          className="text-16-medium text-black-100"
          aria-label={`${thumbsDown} thumbs down votes`}
        >
          {thumbsDown}
        </span>
      </div>
    </div>
  );
};

export default VoteDisplay;