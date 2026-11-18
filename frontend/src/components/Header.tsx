import type { ApiStatus } from "../api/types";

interface HeaderProps {
  apiStatus: ApiStatus;
}

const STATUS_LABEL: Record<ApiStatus, string> = {
  checking: "Connexion…",
  online: "API connectée",
  offline: "Mode hors ligne",
};

export function Header({ apiStatus }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#top" aria-label="Céline Dion — accueil">
          <span className="brand__monogram" aria-hidden="true">
            CD
          </span>
          <span className="brand__text">
            <strong>Céline Dion</strong>
            <span>La Voix</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navigation principale">
          <a href="#scene">Le lecteur</a>
          <a href="#discographie">Discographie</a>
          <a href="#apropos">À propos</a>
        </nav>

        <span className={`api-pill api-pill--${apiStatus}`} title="État de l'API du catalogue">
          <span className="api-pill__dot" aria-hidden="true" />
          {STATUS_LABEL[apiStatus]}
        </span>
      </div>
    </header>
  );
}
