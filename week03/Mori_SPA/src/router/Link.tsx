import React, { useContext, ReactNode } from 'react';
import { RouterContext } from './Router';

interface LinkProps {
  to: string;
  children: ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  const { changePath } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    changePath(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};