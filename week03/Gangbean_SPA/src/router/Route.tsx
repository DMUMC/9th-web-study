import { useRouter } from './Router';

interface RouteProps {
    path: string;
    component: React.ComponentType;
}

export const Route = ({ path, component: Component }: RouteProps) => {
    const { path: currentPath } = useRouter();

    if (currentPath !== path) return null;
    return <Component />;
};
