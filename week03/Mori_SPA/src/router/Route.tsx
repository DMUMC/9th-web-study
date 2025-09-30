import { useContext } from 'react';
import { RouterContext } from './Router';

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export const Route = ({ path, component: Component }: RouteProps) => {
  const { path: currentPath } = useContext(RouterContext);

  if (currentPath !== path) {
    return null;
  }

  return <Component />;
};