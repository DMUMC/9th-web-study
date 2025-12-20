export type Movie = {
    adult: boolean
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type MovieResponse = {
    page: number,
    results:[],
    totalPages: number,
    total_results:number
};

export interface MovieDetail extends Movie {
  belongs_to_collection: null | object;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  cast_id: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}