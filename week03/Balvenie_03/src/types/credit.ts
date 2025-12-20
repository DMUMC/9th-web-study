export interface Credit {
    id: number
    name: string
    profile_path: string
    order: number
    character: string | null
    department: string | null
}

export interface CreditResponse {
    cast: Credit[]
    crew: Credit[]
}