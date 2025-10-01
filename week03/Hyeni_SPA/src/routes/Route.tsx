import React from 'react';

export type RouteProps = {
  path: string;
  component: React.ComponentType;
};

const Route: React.FC<RouteProps> = ({ component: Component }) => {
  return <Component />;
};

export default Route;
