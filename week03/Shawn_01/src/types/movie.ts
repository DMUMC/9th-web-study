export interface MovieT {
    id: number
    title: string
    overview: string
    poster_path: string
    release_date: string
    vote_average: number
    vote_count: number
}

export interface MovieResponseT {
    results: MovieT[]
    page: number
    total_pages: number
    total_results: number
}