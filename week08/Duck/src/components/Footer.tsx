import { Link } from "react-router-dom";
// import React from 'react'; // React 임포트는 생략되어 있으나, FC 정의를 위해 필요할 수 있습니다.

const Footer = () => {
  return (
    <footer className="border-t border-pink-100/50 bg-white/80 backdrop-blur-sm py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-medium text-gray-600">
            &copy; {new Date().getFullYear()} 🎵 Spinning Dolimpan. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              to={"#"}
              className="font-medium text-gray-600 transition-colors hover:text-pink-600"
            >
              Privacy Policy
            </Link>
            <Link
              to={"#"}
              className="font-medium text-gray-600 transition-colors hover:text-pink-600"
            >
              Terms of Service
            </Link>
            <Link
              to={"#"}
              className="font-medium text-gray-600 transition-colors hover:text-pink-600"
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
