import { useParams } from "react-router-dom"

export const MovieDetailPage = () => {
  const params = useParams();
  console.log(params);
  return (
    <div>MovieDetailPage</div>
  )
}
