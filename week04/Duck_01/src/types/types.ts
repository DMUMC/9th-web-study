// Movie 관련 타입들
export interface MovieT {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponseT {
  results: MovieT[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface MovieDetailT {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
}

// Credit 관련 타입들
export interface CreditT {
  id: number;
  name: string;
  profile_path: string;
  order: number;
  character: string | null;
  department: string | null;
}

export interface CreditResponseT {
  cast: CreditT[];
  crew: CreditT[];
}
