import { Link } from 'react-router-dom';
import type { Lp } from '../types/lp';

interface LpCardProps {
  lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
  const formattedDate = new Date(lp.createdAt).toLocaleDateString('ko-KR');
  
  const displayArtist = lp.authorId ? `Artist #${lp.authorId}` : 'Unknown Artist';

  const getThumbnailUrl = (thumbnail: string | undefined) => {
  if (!thumbnail || !thumbnail.startsWith('http')) {
    return `https://picsum.photos/seed/${thumbnail || 'default'}/400/400`;
  }
  return thumbnail;
};

  return (
    <Link 
      to={`/lp/${String(lp.id)}`} 
      className="group block bg-neutral-800 rounded-lg shadow-md overflow-hidden
                 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <img 
          src={getThumbnailUrl(lp.thumbnail)} 
          alt={lp.title} 
          className="..." 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
          }}
        />
        
        <div 
          className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                     p-4 flex flex-col justify-end 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
        >
          <h3 className="text-lg font-bold truncate mb-1">{lp.title}</h3>
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              ❤️
              <span>{lp.likeCount || 0}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 group-hover:hidden">
        <h3 className="font-bold text-lg truncate text-white">{lp.title}</h3>
        <p className="text-sm text-gray-400">{displayArtist}</p>
      </div>
    </Link>
  );
};