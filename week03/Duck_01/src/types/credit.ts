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
