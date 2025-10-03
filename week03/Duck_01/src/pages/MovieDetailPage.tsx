import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const { id } = useParams<{ id: string }>();
  return <div>MovieDetailPage {params.movieid}</div>;
}
