import { Children, cloneElement, useMemo } from "react"
import { useCurrentPath } from "../utils/useCurrentPath";

interface RouterProps {
    children: React.ReactNode
}

export const Routes = ({ children }: RouterProps) => {
    const currentPath = useCurrentPath()

    // isRouteElement 함수 정의 (Route 컴포넌트만 필터링)
    function isRouteElement(element: React.ReactNode): element is React.ReactElement<{ path: string }> {
        return (
            typeof element === "object" &&
            element !== null &&
            "type" in element &&
            typeof element.type === "function" &&
            (element.type as { name?: string }).name === "Route" &&
            "props" in element &&
            typeof (element as React.ReactElement<{ path: string }>).props.path === "string"
        );
    }

    const activeRoute = useMemo(() => {
        const routes = Children.toArray(children).filter(isRouteElement);
        return routes.find(route => route.props.path === currentPath);
    }, [children, currentPath]);

    if (!activeRoute) return null;
    return cloneElement(activeRoute)
}