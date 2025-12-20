import type { CastMember } from "../types/movies"
import { CastCard } from "./CastCard";

interface MovieCreditInfoProps {
  casts: CastMember[];
}

export const MovieCreditInfo = ({ casts }:MovieCreditInfoProps) => {
  return (
    <div className="bg-black">
      <div className="border-t-2 border-white mx-8" />
      <p className="p-8 pt-4 text-white text-3xl font-bold">감독/출연</p>
      <div className="px-8 grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9">
        {casts && casts.map((cast) => (
          <CastCard key={cast.cast_id} cast={cast} />
        ))}
      </div>
    </div>
  )
}
