function pathToRegex(path) {
    const pattern = "^" + path.replace(/\/:\w+/g, "/([^/]+)").replace(/\//g, "\\/") + "$";
    return new RegExp(pattern);
}
function getParams(match) {
    const values = match.result ? match.result.slice(1) : [];
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((m) => m[1]);
    const entries = keys.map((k, i) => [k, (values[i] || "")]);
    return Object.fromEntries(entries);
}
const Home = () => `
    <h1>Home</h1>
    <p>History API + TypeScript</p>
    <button id="sayHi">버튼</button>
    <p><a href="/users/7" data-link>Users</a></p>
    `;
const About = () => `
    <h1>About</h1>
    `;
const UserDetail = (params) => {
    const id = params?.id ?? "unknown";
    return `
            <h1>User Details</h1>
            <p>현재 사용자 ID: <b>${id}</b></p>
            <p><a href="/users/${Number(id) + 1}" data-link>다음 사용자</a></p>
        `;
};
const NotFound = () => /* html */ `
  <h1>404</h1>
  <p>NotFound</p>
`;
const routes = [
    { path: "/", view: Home },
    { path: "/about", view: About },
    { path: "/users/:id", view: UserDetail },
];
async function router() {
    const potentialMatches = routes.map((route) => ({
        route,
        result: location.pathname.match(pathToRegex(route.path)),
    }));
    let match = potentialMatches.find((m) => m.result !== null);
    const app = document.getElementById("app");
    if (!app)
        return;
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
function setActiveLink() {
    const links = document.querySelectorAll("a[data-link]");
    links.forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("active", href === location.pathname);
    });
}
function navigateTo(url) {
    history.pushState(null, "", url);
    void router();
}
window.addEventListener("popstate", () => void router());
document.addEventListener("click", (e) => {
    const target = e.target;
    const anchor = target?.closest("a[data-link]");
    if (!anchor)
        return;
    const isLeftClick = e.button === 0;
    const hasModKey = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    const isBlank = anchor.target === "_blank";
    if (!isLeftClick || hasModKey || isBlank)
        return;
    const href = anchor.getAttribute("href");
    if (!href)
        return;
    const dest = new URL(href, location.origin);
    if (dest.origin !== location.origin)
        return;
    e.preventDefault();
    navigateTo(dest.pathname + dest.search + dest.hash);
});
function afterRender(path, params) {
    if (path === "/") {
        const btn = document.getElementById("sayHi");
        btn?.addEventListener("click", () => {
            alert("Hello from Home!");
        });
    }
    if (path === "/users/:id") {
    }
}
void router();
export {};
//# sourceMappingURL=api.js.map