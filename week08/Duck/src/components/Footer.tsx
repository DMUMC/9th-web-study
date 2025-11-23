import { Link } from "react-router-dom";
// import React from 'react'; // React 임포트는 생략되어 있으나, FC 정의를 위해 필요할 수 있습니다.

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gradient-to-br from-white to-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Spinning Spinning Dolimpan
            </p>
            <p className="mt-1 text-xs text-gray-500">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              to={"#"}
              className="text-gray-600 transition-colors hover:text-pink-600"
            >
              Privacy Policy
            </Link>
            <Link
              to={"#"}
              className="text-gray-600 transition-colors hover:text-pink-600"
            >
              Terms of Service
            </Link>
            <Link
              to={"#"}
              className="text-gray-600 transition-colors hover:text-pink-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
