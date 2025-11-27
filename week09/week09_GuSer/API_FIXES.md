# API 수정 사항

## 주요 수정 내용

### 1. FormData 배열 전송 방식
- `tags[]` → `tags`로 변경 (NestJS는 배열을 동일한 키로 여러 번 append하면 자동으로 배열로 처리)

### 2. Axios 인터셉터 개선
- FormData 전송 시 Content-Type을 자동으로 설정하도록 수정
- `withCredentials: true` 추가 (쿠키 기반 인증 지원)

### 3. 에러 처리 개선
- 로그인/회원가입 실패 시 에러 로깅 추가
- LP 목록 로드 실패 시 상세 에러 메시지 표시

### 4. 응답 데이터 구조
- 서버 응답 구조에 맞게 주석 추가
- 필요시 `response.data.data` 또는 `response.data`로 조정 가능

## Swagger 문서 확인 필요 사항

실제 Swagger 문서를 확인하여 다음을 확인하세요:

1. **회원가입 API** (`POST /v1/auth/signup`)
   - 요청 body 형식: `{ email, password, nickname }`
   - 응답 형식: `{ accessToken, refreshToken, user }` 또는 `{ data: { ... } }`

2. **로그인 API** (`POST /v1/auth/signin`)
   - 요청 body 형식: `{ email, password }`
   - 응답 형식 확인

3. **LP 목록 API** (`GET /v1/lps`)
   - 쿼리 파라미터: `cursor`, `sort`
   - 응답 형식: `{ lps: [], nextCursor: string, hasNext: boolean }` 또는 다른 구조

4. **태그 배열 전송**
   - FormData에서 배열 전송 방식 확인
   - `tags` 또는 `tags[]` 중 어떤 형식인지 확인

## 디버깅 방법

1. 브라우저 개발자 도구 → Network 탭에서 실제 요청/응답 확인
2. 콘솔에서 에러 메시지 확인
3. Swagger UI에서 API 테스트 후 실제 응답 구조 확인

