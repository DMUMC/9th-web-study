import React from "react";

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>🦆 Duck SPA에 오신 것을 환영합니다!</h1>
        <p>
          이것은 React와 TypeScript를 사용한 Single Page Application 예시입니다.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">시작하기</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
