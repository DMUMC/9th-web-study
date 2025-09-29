interface LinkProps {
    href: string
    children: React.ReactNode
}

const Link = ({ href, children }: LinkProps) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        if (window.location.pathname === href) return
        window.history.pushState({}, '', href)
        const navEvent = new PopStateEvent('popstate')
        window.dispatchEvent(navEvent)
    }

    return (
        <a href={href} onClick={handleClick}>
            {children}
        </a>
    )
}

export default Link