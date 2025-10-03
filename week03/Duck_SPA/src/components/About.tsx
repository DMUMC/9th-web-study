import React from "react";

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="about-section">
        <h1>🦆 Duck SPA 소개</h1>
        <div className="about-content">
          <div className="about-text">
            <h2>프로젝트 개요</h2>
            <p>
              Duck SPA는 React와 TypeScript를 사용하여 만든 현대적인 Single Page
              Application입니다. 이 프로젝트는 SPA의 기본 개념을 이해하고
              학습하기 위한 예시 프로젝트입니다.
            </p>

            <h3>사용된 기술</h3>
            <ul className="tech-list">
              <li>React 19</li>
              <li>TypeScript</li>
              <li>React Router DOM</li>
              <li>Vite</li>
              <li>CSS3</li>
            </ul>

            <h3>주요 특징</h3>
            <ul className="features-list">
              <li>✅ 클라이언트 사이드 라우팅</li>
              <li>✅ 컴포넌트 기반 아키텍처</li>
              <li>✅ TypeScript 타입 안정성</li>
              <li>✅ 반응형 디자인</li>
              <li>✅ 모던 개발 도구</li>
            </ul>
          </div>

          <div className="about-image">
            <div className="duck-illustration">
              🦆
              <p>Duck SPA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
