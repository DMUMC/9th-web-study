import { Link } from "react-router-dom";
// import React from 'react'; // React 임포트는 생략되어 있으나, FC 정의를 위해 필요할 수 있습니다.

const Footer = () => {
  // 또는 const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 py-8 mt-12 shadow-lg">
      <div className="container mx-auto text-center text-white">
        <p className="text-lg font-semibold mb-2">
          &copy; {new Date().getFullYear()} SpinningSpinning Dolimpan
        </p>
        <p className="text-white/80 text-sm mb-4">All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <Link
            to={"#"}
            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            to={"#"}
            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            Terms of Service
          </Link>
          <Link
            to={"#"}
            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
