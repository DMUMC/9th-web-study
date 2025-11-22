# 🍠 트러블 슈팅

실습을 진행하면서 생긴 문제들 또는 어려웠던 내용에 대해서, 이슈 - 문제 - 해결 순서로 작성해 주세요.

---

## 🍠 이슈 No.1

### 이슈 👉
마이페이지에서 닉네임 변경 요청 시, 서버의 응답(성공/실패)을 기다리기 전에 Nav-Bar와 마이페이지의 닉네임을 즉시 변경해야 합니다.

### 문제 👉
- 프로필 수정 시 서버 응답을 기다려야만 UI가 업데이트되어 사용자 경험이 좋지 않았습니다.
- `useUpdateMyInfo` 훅에서 `onSuccess`에서만 쿼리를 무효화하여 서버 응답 후에야 UI가 변경되었습니다.

### 해결 👉
- `useUpdateMyInfo` 훅에 `onMutate`를 추가하여 낙관적 업데이트(Optimistic Update)를 구현했습니다.
- `onMutate`에서 `queryClient.setQueryData`를 사용하여 `myInfo` 쿼리 캐시를 즉시 업데이트했습니다.
- `onError`에서 `context.previousData`를 사용하여 에러 발생 시 이전 데이터로 롤백하도록 구현했습니다.
- `Navbar`와 `MyPage` 모두 `useGetMyInfo` 훅을 사용하여 동일한 쿼리 캐시를 참조하므로, 한 곳에서 업데이트하면 두 곳 모두 즉시 반영됩니다.

---

## 🍠 이슈 No.2

### 이슈 👉
게시글 상세 조회에서 좋아요를 누를 때 낙관적 업데이트(Optimistic Update)를 이용하여 바로 좋아요가 반영되도록 구현해야 합니다. 좋아요 기능은 전역적으로 관리되어야 합니다.

### 문제 👉
- 좋아요 버튼을 클릭해도 서버 응답을 기다려야만 UI가 업데이트되었습니다.
- 상세 페이지와 목록 페이지의 좋아요 상태가 동기화되지 않았습니다.
- 좋아요 취소가 제대로 작동하지 않았습니다.

### 해결 👉
- `useToggleLike` 훅을 생성하여 낙관적 업데이트를 구현했습니다.
- `onMutate`에서 LP 상세 쿼리(`[QUERY_KEY.lp, 'detail', lpId]`)와 LP 목록 쿼리(`[QUERY_KEY.lps]`) 모두를 즉시 업데이트했습니다.
- `getQueriesData({ queryKey: [QUERY_KEY.lps] })`를 사용하여 모든 LP 목록 쿼리(다양한 정렬/검색 조건)를 찾아 업데이트했습니다.
- API 엔드포인트를 분리: 좋아요 추가는 `POST /v1/lps/{lpId}/likes`, 취소는 `DELETE /v1/lps/{lpId}/likes`를 사용하도록 변경했습니다.
- `mutationFn`에서 현재 좋아요 상태(`isLiked`)를 받아서 적절한 API를 호출하도록 구현했습니다.
- `onError`에서 모든 쿼리의 이전 데이터를 백업하고 롤백하도록 구현했습니다.

---

## 🍠 이슈 No.3

### 이슈 👉
자신이 로그인하여 작성한 글에만 수정 또는 삭제 버튼이 떠야 하고 남이 작성한 게시글에는 수정 삭제 버튼이 없어야 합니다.

### 문제 👉
- `accessToken`이 있으면 모든 게시글에 수정/삭제 버튼이 표시되었습니다.
- 게시글 작성자와 현재 로그인한 사용자를 비교하는 로직이 없었습니다.

### 해결 👉
- `LpDetailPage`에서 `useGetMyInfo` 훅을 사용하여 현재 사용자 정보를 가져왔습니다.
- `isAuthor` 변수를 추가하여 `lp.authorId`와 `myInfo?.data?.id`를 비교했습니다.
- 수정/삭제 버튼의 조건을 `accessToken`에서 `isAuthor`로 변경했습니다.

---

## 🍠 이슈 No.4

### 이슈 👉
LP 생성 시 이미지도 함께 업로드해야 합니다. 이미지는 Base64 형식으로 JSON body에 포함되어 전송됩니다.

### 문제 👉
- 초기에는 `FormData`를 사용했지만, API 문서에 따르면 JSON body에 Base64 문자열로 전송해야 했습니다.
- 이미지 파일을 Base64로 변환하는 로직이 필요했습니다.
- Base64 문자열이 너무 길어서 URL에 포함되면 `431 Request Header Fields Too Large` 에러가 발생했습니다.

### 해결 👉
- `LpCreateModal`에서 `FileReader`를 사용하여 이미지 파일을 Base64 data URL로 변환했습니다.
- Base64 data URL에서 `data:image/...` 접두사를 제거하고 순수 Base64 문자열만 추출했습니다.
- JSON body에 `thumbnail` 필드로 Base64 문자열을 포함하여 전송했습니다.
- `getImageUrl` 유틸리티 함수를 생성하여 Base64 문자열을 data URL로 변환하여 `<img>` 태그에 사용할 수 있도록 했습니다.
- 이미지 파일 크기 제한(5MB)을 추가했습니다.

---

## 🍠 이슈 No.5

### 이슈 👉
무한 새로고침이 발생합니다.

### 문제 👉
- `useGetMyInfo` 훅이 `accessToken`이 없을 때도 호출되어 401 에러가 반복적으로 발생했습니다.
- `Navbar`에서 `accessToken`이 없어도 `useGetMyInfo`를 호출하고 있었습니다.

### 해결 👉
- `useGetMyInfo` 훅에 `enabled: !!accessToken` 옵션을 추가하여 `accessToken`이 있을 때만 쿼리를 실행하도록 했습니다.
- `retry: false` 옵션을 추가하여 401 에러 시 재시도하지 않도록 했습니다.

---

## 🍠 이슈 No.6

### 이슈 👉
댓글이 정상적으로 생성되고 목록 조회가 되는 것은 네트워크 탭으로 확인했지만, 댓글 목록이 렌더되지 않고 있습니다.

### 문제 👉
- `useGetComments` 훅에서 API 응답 구조를 제대로 파싱하지 못했습니다.
- `CursorBasedResponse` 형식에서 `data.data.data`가 배열이거나 빈 객체일 수 있는데, 이를 제대로 처리하지 못했습니다.
- 댓글 생성 후 목록이 자동으로 업데이트되지 않았습니다.

### 해결 👉
- `getComments` API 함수에서 다양한 응답 구조를 처리하도록 수정했습니다:
  - `data.data.data`가 배열인지 확인
  - `data.data`가 배열인지 확인
  - `data.data`가 빈 객체인 경우 빈 배열 반환
- `useGetComments` 훅에서 `staleTime: 0`과 `refetchOnMount: true`를 설정하여 항상 최신 데이터를 가져오도록 했습니다.
- `useCreateComment` 훅의 `onSuccess`에서 `refetchComments()`를 명시적으로 호출했습니다.

---

## 🍠 이슈 No.7

### 이슈 👉
상세 페이지에서 좋아요를 취소해도 목록 페이지에서는 좋아요가 된 것으로 표시되고 있습니다.

### 문제 👉
- `useGetInfiniteLpList`의 `queryKey`는 `[QUERY_KEY.lps, 'infinite', search, order, limit]` 형태인데, `useToggleLike`에서는 `[QUERY_KEY.lps]`만 업데이트하고 있었습니다.
- `useInfiniteQuery`의 `pages` 배열 구조를 제대로 업데이트하지 못했습니다.

### 해결 👉
- `getQueriesData({ queryKey: [QUERY_KEY.lps] })`를 사용하여 `[QUERY_KEY.lps]`로 시작하는 모든 쿼리를 찾았습니다.
- 각 쿼리의 `pages` 배열을 순회하며 해당 LP의 `likes` 배열을 업데이트했습니다.
- `onError`에서도 모든 LP 목록 쿼리의 이전 데이터를 백업하고 롤백하도록 수정했습니다.

---

## 🍠 이슈 No.8

### 이슈 👉
좋아요 버튼을 하트 아이콘으로 변경하고, 빈 하트와 채워진 하트로 구분해야 합니다. 상세 페이지 이미지 크기도 조정이 필요합니다.

### 문제 👉
- 좋아요 버튼이 텍스트로만 표시되어 시각적 피드백이 부족했습니다.
- 상세 페이지 이미지가 너무 크거나 비율이 맞지 않았습니다.

### 해결 👉
- 좋아요 상태에 따라 SVG 하트 아이콘을 조건부 렌더링했습니다:
  - 좋아요가 있는 경우: `fill-current`로 채워진 하트
  - 좋아요가 없는 경우: `fill-none stroke-current`로 빈 하트
- 상세 페이지 이미지에 `max-h-[70vh]`, `max-w-4xl`, `object-contain`을 적용하여 화면 크기에 맞게 조정했습니다.
- `flex justify-center`와 `shadow-lg`를 추가하여 시각적 개선을 했습니다.

---

## 🍠 이슈 No.9

### 이슈 👉
프로필 수정 API 엔드포인트가 `PATCH /v1/users`이고, JSON body로 데이터를 전송해야 합니다.

### 문제 👉
- 기존에는 `PUT /v1/users/me`를 사용하고 있었고, `FormData`를 사용하고 있었습니다.
- API 문서와 실제 구현이 일치하지 않았습니다.

### 해결 👉
- `updateMyInfo` API 함수를 `PATCH /v1/users`로 변경하고 JSON body를 받도록 수정했습니다.
- `ProfileEditModal`에서 `FormData` 대신 JSON 객체를 생성하여 전송하도록 변경했습니다.
- `useUpdateMyInfo` 훅도 새로운 API 시그니처에 맞게 수정했습니다.

---

## 🍠 이슈 No.10

### 이슈 👉
댓글 목록 조회와 댓글 생성은 특정 API 경로를 사용해야 합니다.

### 문제 👉
- 댓글 API 경로가 명확하지 않았고, 응답 구조를 제대로 파싱하지 못했습니다.

### 해결 👉
- `getComments` API 함수에서 `CursorBasedResponse` 형식을 올바르게 처리하도록 수정했습니다.
- `createComment`는 `POST /v1/lps/{lpId}/comments`를 사용하도록 확인했습니다.
- `getComments`는 `GET /v1/lps/{lpId}/comments`를 사용하고, 쿼리 파라미터로 `cursor`, `limit`, `order`를 전달하도록 했습니다.



