import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="flex justify-between">
                <h1 className="text-2xl">인프런</h1>
                <div>
                    <Link to={'/login'} className="p-6">
                        로그인
                    </Link>
                    <Link to={'/signup'}>회원가입</Link>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
};

export default HomeLayout;
