import { Link } from 'react-router-dom';
// import React from 'react'; // React 임포트는 생략되어 있으나, FC 정의를 위해 필요할 수 있습니다.

const Footer = () => {
    // 또는 const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
                <p>
                    &copy; {new Date().getFullYear()} SpinningSpinning Dolimpan.
                    All rights reserved.
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                    <Link
                        to={'#'}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to={'#'}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        to={'#'}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 text-sm"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
