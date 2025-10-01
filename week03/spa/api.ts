type Params = Record<string, string>;

type ViewFn = (params?:Params) => string;

type Route = {
    path: string;
    view: ViewFn;
};

type PotentialMatch = {
    route: Route;
    result: RegExpMatchArray | null;
}

function pathToRegex(path: string): RegExp {
    const pattern = "^" + path.replace(/\/:\w+/g, "/([^/]+)").replace(/\//g, "\\/") + "$";
    return new RegExp(pattern);
}

function getParams(match: PotentialMatch): Params {
    const values: string[] = match.result ? match.result.slice(1) as string[] : [];
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((m) => m[1]);
    const entries = keys.map<[string, string]>((k, i) => [k, (values[i] || "") as string]);
    return Object.fromEntries(entries);
}

const Home: ViewFn = () => 
    `
    <h1>Home</h1>
    <p>History API + TypeScript</p>
    <button id="sayHi">버튼</button>
    <p><a href="/users/7" data-link>Users</a></p>
    `;

const About: ViewFn = () =>
    `
    <h1>About</h1>
    `;

const UserDetail: ViewFn = (params) => {
    const id = params?.id ?? "unknown";
    return`
            <h1>User Details</h1>
            <p>현재 사용자 ID: <b>${id}</b></p>
            <p><a href="/users/${Number(id) + 1}" data-link>다음 사용자</a></p>
        `;
};

const NotFound: ViewFn = () => /* html */ `
  <h1>404</h1>
  <p>NotFound</p>
`;

const routes: Route[] = [
    { path: "/",          view: Home },
    { path: "/about",     view: About },
    { path: "/users/:id", view: UserDetail },
];

async function router(): Promise<void> {
    const potentialMatches: PotentialMatch[] = routes.map((route) => ({
        route,
        result: location.pathname.match(pathToRegex(route.path)),
    }));

    let match = potentialMatches.find((m) => m.result !== null);

    const app = document.getElementById("app") as HTMLElement | null;
    if (!app) return;

    if (!match) {
        app.innerHTML = NotFound();
        setActiveLink();
        return;
    }

    const params = getParams(match);
    const viewHTML = match.route.view(params);
    app.innerHTML = viewHTML;

    afterRender(match.route.path, params);

    setActiveLink();
    app.focus();
}

function setActiveLink(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>("a[data-link]");
    links.forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("active", href === location.pathname);
    });
}

function navigateTo(url: string): void {
    history.pushState(null, "", url);
    void router();
}

window.addEventListener("popstate", () => void router());

document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as Element | null;
    const anchor = target?.closest("a[data-link]") as HTMLAnchorElement | null;
    if (!anchor) return;

    const isLeftClick = e.button === 0;
    const hasModKey = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    const isBlank = anchor.target === "_blank";
    if (!isLeftClick || hasModKey || isBlank) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    const dest = new URL(href, location.origin);
    if (dest.origin !== location.origin) return;

    e.preventDefault();
    navigateTo(dest.pathname + dest.search + dest.hash);
});

function afterRender(path: string, params: Params): void {
    if (path === "/") {
        const btn = document.getElementById("sayHi") as HTMLButtonElement | null;
        btn?.addEventListener("click", () => {
        alert("Hello from Home!");
        });
    }
    if (path === "/users/:id") {
    }
}

void router();