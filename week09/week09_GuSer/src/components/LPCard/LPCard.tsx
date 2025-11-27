import { Link } from 'react-router-dom';
import type { LP } from '../../apis/lp';
import { formatDate } from '../../utils/date';

interface LPCardProps {
  lp: LP;
}

const LPCard = ({ lp }: LPCardProps) => {
  if (!lp || !lp.id) {
    return null;
  }

  return (
    <Link
      to={`/lp/${lp.id}`}
      className="group relative block bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={lp.imageUrl || '/placeholder.png'}
          alt={lp.name || 'LP'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-white font-bold text-lg mb-2">{lp.name || '제목 없음'}</h3>
            <p className="text-gray-300 text-sm mb-1">
              {lp.createdAt ? formatDate(lp.createdAt) : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-pink-500">❤️</span>
              <span className="text-white">{lp.likeCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{lp.name || '제목 없음'}</h3>
        <p className="text-gray-400 text-sm truncate">{lp.author?.nickname || '작성자 없음'}</p>
      </div>
    </Link>
  );
};

export default LPCard;

