import React, { Children, useMemo, useState, useEffect } from 'react';
import type { ReactElement } from 'react';  // 타입 전용 import
import Route from './Route';

function isRouteElement(element: React.ReactNode): element is ReactElement<{ path: string }> {
  return React.isValidElement(element) && element.type === Route;
}

export type RoutesProps = {
  children: React.ReactNode;
};

const Routes: React.FC<RoutesProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;

  return React.cloneElement(activeRoute);
};

export default Routes;
