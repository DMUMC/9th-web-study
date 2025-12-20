/**
 * Base64 문자열을 data URL로 변환하는 유틸리티 함수
 * @param thumbnail 이미지 URL 또는 Base64 문자열
 * @returns data URL 형식의 이미지 URL
 */
export const getImageUrl = (thumbnail: string | null | undefined): string => {
    if (!thumbnail) return '';
    
    // 이미 URL인 경우 (http:// 또는 https://로 시작)
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
        return thumbnail;
    }
    
    // 이미 data URL인 경우 (data:로 시작)
    if (thumbnail.startsWith('data:')) {
        return thumbnail;
    }
    
    // Base64 문자열인 경우 data URL로 변환
    // Base64 문자열은 일반적으로 매우 길고, URL 형식이 아닙니다
    // MIME 타입을 추론하기 어려우므로 기본적으로 image/png로 설정
    // 또는 Base64 문자열의 길이와 패턴으로 판단
    if (thumbnail.length > 100 && /^[A-Za-z0-9+/=]+$/.test(thumbnail)) {
        // Base64 문자열로 판단
        // 일반적인 이미지 MIME 타입 시도
        // PNG: iVBORw0KGgo로 시작
        if (thumbnail.startsWith('iVBORw0KGgo')) {
            return `data:image/png;base64,${thumbnail}`;
        }
        // JPEG: /9j/4AAQSkZJRg로 시작
        if (thumbnail.startsWith('/9j/4AAQSkZJRg') || thumbnail.startsWith('/9j/')) {
            return `data:image/jpeg;base64,${thumbnail}`;
        }
        // GIF: R0lGODlh로 시작
        if (thumbnail.startsWith('R0lGODlh')) {
            return `data:image/gif;base64,${thumbnail}`;
        }
        // 기본값: PNG로 가정
        return `data:image/png;base64,${thumbnail}`;
    }
    
    // 그 외의 경우 원본 반환
    return thumbnail;
};