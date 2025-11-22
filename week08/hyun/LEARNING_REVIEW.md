# 📚 학습 회고

프로젝트를 진행하며 요구했던 부분들과 학습한 개념, 얻은 경험에 대한 회고입니다.

---

## 1. 낙관적 업데이트 (Optimistic Update)

### 요구사항
- 마이페이지에서 닉네임 변경 시 서버 응답을 기다리지 않고 즉시 UI 업데이트
- 좋아요 버튼 클릭 시 즉시 반영되어야 함

### 학습한 개념

#### React Query의 낙관적 업데이트
낙관적 업데이트는 서버 응답을 기다리기 전에 사용자가 예상하는 결과를 먼저 UI에 반영하는 기법입니다.

**핵심 메서드:**
- `onMutate`: mutation 실행 전에 호출되는 콜백
- `queryClient.setQueryData`: 쿼리 캐시를 직접 업데이트
- `queryClient.cancelQueries`: 진행 중인 쿼리 취소
- `context`: 롤백을 위한 이전 데이터 저장

**구현 패턴:**
```typescript
onMutate: async (newData) => {
  // 1. 진행 중인 쿼리 취소
  await queryClient.cancelQueries({ queryKey: ['myInfo'] });
  
  // 2. 이전 데이터 백업
  const previousData = queryClient.getQueryData(['myInfo']);
  
  // 3. 캐시 즉시 업데이트
  queryClient.setQueryData(['myInfo'], (old) => {
    return { ...old, data: { ...old.data, ...newData } };
  });
  
  // 4. 롤백을 위한 데이터 반환
  return { previousData };
},
onError: (error, variables, context) => {
  // 에러 발생 시 이전 데이터로 롤백
  if (context?.previousData) {
    queryClient.setQueryData(['myInfo'], context.previousData);
  }
}
```

### 얻은 경험
- **사용자 경험의 중요성**: 서버 응답을 기다리지 않고 즉시 피드백을 제공하면 앱이 훨씬 반응적으로 느껴집니다.
- **에러 처리의 중요성**: 낙관적 업데이트는 실패할 수 있으므로 반드시 롤백 로직을 구현해야 합니다.
- **캐시 관리**: React Query의 쿼리 캐시를 직접 조작하는 방법을 배웠고, 여러 컴포넌트가 같은 쿼리를 참조하면 자동으로 동기화된다는 것을 이해했습니다.

---

## 2. 전역 상태 관리와 쿼리 캐시 동기화

### 요구사항
- 좋아요 기능은 전역적으로 관리되어야 함
- 상세 페이지에서 좋아요를 취소하면 목록 페이지에도 즉시 반영되어야 함

### 학습한 개념

#### React Query의 쿼리 키와 캐시 구조
React Query는 쿼리 키를 기반으로 캐시를 관리합니다. 같은 쿼리 키를 사용하는 모든 컴포넌트는 동일한 캐시를 공유합니다.

**쿼리 키 패턴:**
```typescript
// 단일 쿼리
['myInfo']

// 파라미터가 있는 쿼리
['lp', 'detail', lpId]

// 무한 스크롤 쿼리
['lps', 'infinite', search, order, limit]
```

**여러 쿼리 업데이트:**
```typescript
// 특정 쿼리만 업데이트
queryClient.setQueryData(['lp', 'detail', lpId], newData);

// 패턴으로 여러 쿼리 찾기
const queries = queryClient.getQueriesData({ queryKey: ['lps'] });
queries.forEach(([queryKey, queryData]) => {
  queryClient.setQueryData(queryKey, updatedData);
});
```

#### useInfiniteQuery의 구조
무한 스크롤을 위한 `useInfiniteQuery`는 `pages` 배열을 사용합니다:
```typescript
{
  pages: [
    { data: { data: [lp1, lp2], nextCursor: 10, hasNext: true } },
    { data: { data: [lp3, lp4], nextCursor: 20, hasNext: false } }
  ],
  pageParams: [0, 10]
}
```

### 얻은 경험
- **캐시 동기화의 힘**: 여러 컴포넌트가 같은 데이터를 사용할 때, 한 곳에서 업데이트하면 모든 곳에 자동으로 반영되는 것이 매우 강력합니다.
- **쿼리 키 설계의 중요성**: 쿼리 키를 잘 설계하면 원하는 데이터를 쉽게 찾고 업데이트할 수 있습니다.
- **복잡한 데이터 구조 다루기**: `useInfiniteQuery`의 `pages` 배열을 업데이트하는 것은 복잡했지만, 구조를 이해하면 가능합니다.

---

## 3. 권한 기반 UI 렌더링

### 요구사항
- 자신이 작성한 글에만 수정/삭제 버튼 표시
- 작성자와 현재 사용자 비교

### 학습한 개념

#### 조건부 렌더링과 useMemo
```typescript
// 현재 사용자가 작성자인지 확인
const isAuthor = useMemo(() => {
  if (!lp || !myInfo?.data?.id) return false;
  return lp.authorId === myInfo.data.id;
}, [lp, myInfo]);

// 조건부 렌더링
{isAuthor && (
  <>
    <button>수정</button>
    <button>삭제</button>
  </>
)}
```

**useMemo를 사용하는 이유:**
- `lp`와 `myInfo`가 변경될 때만 재계산
- 불필요한 재렌더링 방지
- 복잡한 계산 결과를 메모이제이션

### 얻은 경험
- **보안과 UX의 균형**: 클라이언트에서 권한을 체크하는 것은 UX를 위한 것이지, 보안을 위한 것이 아닙니다. 실제 권한 체크는 서버에서 해야 합니다.
- **데이터 의존성 관리**: `useMemo`를 사용하여 불필요한 재계산을 방지하는 것이 성능에 도움이 됩니다.

---

## 4. 파일 업로드와 Base64 인코딩

### 요구사항
- LP 생성 시 이미지를 Base64 형식으로 JSON body에 포함하여 전송

### 학습한 개념

#### FileReader API
```typescript
const reader = new FileReader();
reader.onloadend = () => {
  const base64DataUrl = reader.result as string;
  // data:image/png;base64,iVBORw0KG... 형식
  const base64String = base64DataUrl.split(',')[1]; // 순수 Base64만 추출
};
reader.readAsDataURL(file);
```

#### Base64 vs FormData
- **Base64 (JSON)**: 
  - 장점: JSON body에 포함 가능, 단일 요청으로 처리
  - 단점: 파일 크기가 약 33% 증가, URL 길이 제한 문제
- **FormData (multipart/form-data)**:
  - 장점: 효율적인 바이너리 전송, 큰 파일 처리에 적합
  - 단점: 별도의 Content-Type 설정 필요

#### 이미지 URL 처리
```typescript
// Base64 문자열을 data URL로 변환
const getImageUrl = (thumbnail: string) => {
  if (thumbnail.startsWith('http')) return thumbnail;
  if (thumbnail.startsWith('data:')) return thumbnail;
  // Base64 문자열인 경우 data URL로 변환
  return `data:image/png;base64,${thumbnail}`;
};
```

### 얻은 경험
- **API 설계의 영향**: API가 Base64를 요구하면 클라이언트에서 변환 로직이 필요하고, 파일 크기 제한도 고려해야 합니다.
- **에러 처리**: `431 Request Header Fields Too Large` 같은 에러를 만나면서 HTTP 상태 코드에 대해 더 깊이 이해하게 되었습니다.
- **유틸리티 함수의 중요성**: `getImageUrl` 같은 유틸리티 함수를 만들어 재사용하면 코드 중복을 줄일 수 있습니다.

---

## 5. React Query의 쿼리 제어

### 요구사항
- `accessToken`이 없을 때는 사용자 정보를 가져오지 않아야 함
- 무한 새로고침 방지

### 학습한 개념

#### enabled 옵션
```typescript
useQuery({
  queryKey: ['myInfo'],
  queryFn: getMyInfo,
  enabled: !!accessToken, // accessToken이 있을 때만 실행
  retry: false, // 401 에러 시 재시도하지 않음
});
```

**enabled의 활용:**
- 조건부 쿼리 실행
- 의존성 있는 쿼리 체인
- 사용자 권한에 따른 쿼리 제어

#### staleTime과 gcTime
- **staleTime**: 데이터가 "신선한" 것으로 간주되는 시간
- **gcTime**: 사용되지 않는 데이터가 캐시에 남아있는 시간

### 얻은 경험
- **조건부 쿼리의 중요성**: 불필요한 API 호출을 방지하고 에러를 줄일 수 있습니다.
- **에러 처리 전략**: 401 에러는 재시도해도 의미가 없으므로 `retry: false`로 설정하는 것이 좋습니다.

---

## 6. API 응답 구조 파싱과 타입 안정성

### 요구사항
- 댓글 목록 조회 시 다양한 응답 구조 처리
- 타입 안정성 유지

### 학습한 개념

#### 타입 가드와 안전한 파싱
```typescript
// 다양한 응답 구조 처리
if (data?.data?.data && Array.isArray(data.data.data)) {
  return { data: data.data.data };
}
if (data?.data && Array.isArray(data.data)) {
  return { data: data.data };
}
if (Array.isArray(data)) {
  return { data };
}
// 빈 객체인 경우
if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
  return { data: [] };
}
```

#### Optional Chaining과 Nullish Coalescing
```typescript
// 안전한 접근
const name = myInfo?.data?.name ?? '익명';
const likes = lp.likes?.length ?? 0;
```

### 얻은 경험
- **방어적 프로그래밍**: API 응답 구조가 일관되지 않을 수 있으므로 다양한 경우를 처리해야 합니다.
- **타입스크립트의 도움**: 타입 정의가 있으면 컴파일 타임에 오류를 잡을 수 있어 안전합니다.
- **점진적 타입 체크**: `Array.isArray()`, `typeof` 등을 사용하여 런타임에 타입을 확인할 수 있습니다.

---

## 7. 상태 관리와 데이터 흐름

### 요구사항
- 좋아요 상태를 전역적으로 관리
- 여러 페이지에서 동일한 상태 유지

### 학습한 개념

#### React Query의 캐시 기반 상태 관리
전역 상태 관리 라이브러리(Redux, Zustand) 없이도 React Query의 쿼리 캐시를 활용하여 전역 상태를 관리할 수 있습니다.

**장점:**
- 서버 상태와 클라이언트 상태를 일관되게 관리
- 자동 캐싱과 동기화
- DevTools 지원

**단점:**
- 서버 상태가 아닌 순수 클라이언트 상태에는 부적합
- 복잡한 상태 로직에는 제한적

### 얻은 경험
- **도구 선택의 중요성**: 모든 상태를 Redux로 관리할 필요는 없고, React Query만으로도 충분한 경우가 많습니다.
- **단일 소스의 원칙**: 같은 데이터는 하나의 쿼리 키로 관리하면 자동으로 동기화됩니다.

---

## 8. UI/UX 개선

### 요구사항
- 좋아요 버튼을 하트 아이콘으로 변경
- 상세 페이지 이미지 크기 조정

### 학습한 개념

#### SVG 아이콘 사용
```typescript
// 조건부 SVG 렌더링
{isLiked ? (
  <svg className="h-5 w-5 fill-current">
    {/* 채워진 하트 */}
  </svg>
) : (
  <svg className="h-5 w-5 fill-none stroke-current stroke-2">
    {/* 빈 하트 */}
  </svg>
)}
```

#### 반응형 이미지 처리
```typescript
// 뷰포트 기반 크기 조정
className="max-h-[70vh] max-w-4xl object-contain"
```

### 얻은 경험
- **시각적 피드백의 중요성**: 아이콘을 사용하면 사용자가 상태를 더 쉽게 이해할 수 있습니다.
- **반응형 디자인**: `vh`, `vw` 단위를 사용하면 다양한 화면 크기에 대응할 수 있습니다.

---

## 종합적인 학습 경험

### 가장 인상 깊었던 부분

1. **낙관적 업데이트의 힘**
   - 서버 응답을 기다리지 않고 즉시 UI를 업데이트하면 앱이 훨씬 빠르게 느껴집니다.
   - 하지만 에러 처리가 필수적입니다.

2. **React Query의 캐시 시스템**
   - 쿼리 키를 잘 설계하면 데이터 동기화가 자동으로 이루어집니다.
   - `getQueriesData`를 사용하여 패턴으로 여러 쿼리를 찾고 업데이트할 수 있습니다.

3. **타입스크립트와 방어적 프로그래밍**
   - 타입 정의가 있으면 안전하지만, 런타임에도 타입 체크가 필요합니다.
   - Optional chaining과 nullish coalescing을 적극 활용하면 안전한 코드를 작성할 수 있습니다.

### 개선하고 싶은 부분

1. **에러 처리 개선**
   - 현재는 `console.error`와 `alert`만 사용하는데, 더 나은 에러 UI를 제공하고 싶습니다.
   - 에러 바운더리를 추가하여 예상치 못한 에러를 처리하고 싶습니다.

2. **로딩 상태 개선**
   - 스켈레톤 UI를 더 많은 곳에 적용하고 싶습니다.
   - 부분 로딩 상태도 고려하고 싶습니다.

3. **성능 최적화**
   - 이미지 lazy loading을 더 적극적으로 활용하고 싶습니다.
   - 불필요한 리렌더링을 줄이기 위해 `React.memo`를 활용하고 싶습니다.

### 앞으로의 학습 방향

1. **테스트 작성**
   - React Query 훅에 대한 테스트 작성 방법을 배우고 싶습니다.
   - 낙관적 업데이트 로직을 테스트하는 방법을 알고 싶습니다.

2. **성능 모니터링**
   - React DevTools Profiler를 사용하여 성능 병목을 찾는 방법을 배우고 싶습니다.
   - 번들 크기 분석과 최적화 방법을 알고 싶습니다.

3. **접근성 개선**
   - ARIA 속성을 더 적극적으로 활용하고 싶습니다.
   - 키보드 네비게이션을 개선하고 싶습니다.

---

## 결론

이번 프로젝트를 통해 React Query의 강력한 기능들을 실제로 활용해볼 수 있었습니다. 특히 낙관적 업데이트와 쿼리 캐시 동기화를 구현하면서, 사용자 경험을 크게 개선할 수 있다는 것을 체감했습니다. 

또한 타입스크립트를 사용하면서 타입 안정성의 중요성을 깨달았고, API 응답 구조가 일관되지 않을 때 어떻게 대응해야 하는지 배웠습니다.

앞으로는 더 나은 에러 처리, 성능 최적화, 테스트 작성에 집중하여 더 견고한 애플리케이션을 만들고 싶습니다.



