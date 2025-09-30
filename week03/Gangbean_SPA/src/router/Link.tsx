import { type MouseEvent, type ReactNode } from 'react';

interface LinkProps {
    to: string;
    children: ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.pathname === to) return;

        window.history.pushState({}, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <a href={to} onClick={handleClick}>
            {children}
        </a>
    );
};
