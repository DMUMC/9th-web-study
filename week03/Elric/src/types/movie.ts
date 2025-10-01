export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview?: string;
  release_date?: string;
};

export type MoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
};
