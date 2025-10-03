import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <h1>🦆 Duck SPA</h1>
        </Link>
      </div>
      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            홈
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={`nav-link ${
              location.pathname === "/about" ? "active" : ""
            }`}
          >
            소개
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={`nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            연락처
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
