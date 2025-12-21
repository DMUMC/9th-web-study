import { useParams } from "react-router-dom"

export const MovieDetailPage = () => {
    const {id} = useParams<{id: string}>();

    console.log(id);
  return (
    <div>
        영화 상세 페이지입니다.
        <h1>ㅎㅇㅎㅇ</h1>
        <h1>{id}번 영화 상세 페이지를 페칭해옵니다.</h1>
    </div>
  )
}
