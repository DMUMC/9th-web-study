import React from 'react';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav>Nav</nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer>Footer</footer>
        </div>
    );
};

export default HomeLayout;
