import type { MovieCredits } from "../types/movies"

interface MovieCreditInfoProps {
  credits: MovieCredits;
}

export const MovieCreditInfo = ({ credits }:MovieCreditInfoProps) => {
  return (
    <div>MovieCreditInfo</div>
  )
}
