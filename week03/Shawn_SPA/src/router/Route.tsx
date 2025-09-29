interface RouteProps {
    path: string
    component: React.ComponentType
}

export const Route = ({ component: Component }: RouteProps) => {
    return <Component />
}
