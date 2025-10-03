import type { CastMember } from "../types/movies";

interface CastCardProps {
  cast: CastMember;
}

export const CastCard = ({ cast }:CastCardProps) => {

  return (
    <div className="flex flex-col items-center h-58">
      <img
        src={`https://image.tmdb.org/t/p/original${cast.profile_path}`}
        className="text-white rounded-full object-cover w-30 h-30 border-2 border-white"
      />
      <p className="text-white text-center mt-2 text-lg font-bold">{cast.name}</p>
      <p className="text-gray-600 text-center mt-1">{cast.character.split('/')[0]}</p>
    </div>
  )
}
