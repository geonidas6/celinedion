import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_LABEL = {
    checking: "Connexion…",
    online: "API connectée",
    offline: "Mode hors ligne",
};
export function Header({ apiStatus }) {
    return (_jsx("header", { className: "site-header", children: _jsxs("div", { className: "site-header__inner", children: [_jsxs("a", { className: "brand", href: "#top", "aria-label": "C\u00E9line Dion \u2014 accueil", children: [_jsx("span", { className: "brand__monogram", "aria-hidden": "true", children: "CD" }), _jsxs("span", { className: "brand__text", children: [_jsx("strong", { children: "C\u00E9line Dion" }), _jsx("span", { children: "La Voix" })] })] }), _jsxs("nav", { className: "main-nav", "aria-label": "Navigation principale", children: [_jsx("a", { href: "#scene", children: "Le lecteur" }), _jsx("a", { href: "#discographie", children: "Discographie" }), _jsx("a", { href: "#apropos", children: "\u00C0 propos" })] }), _jsxs("span", { className: `api-pill api-pill--${apiStatus}`, title: "\u00C9tat de l'API du catalogue", children: [_jsx("span", { className: "api-pill__dot", "aria-hidden": "true" }), STATUS_LABEL[apiStatus]] })] }) }));
}
