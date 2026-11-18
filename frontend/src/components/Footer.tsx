import type { ApiStatus } from "../api/types";

interface FooterProps {
  apiStatus: ApiStatus;
  songCount: number;
  apiSongCount: number;
}

export function Footer({ apiStatus, songCount, apiSongCount }: FooterProps) {
  return (
    <footer className="site-footer" id="apropos">
      <div className="site-footer__grid">
        <div>
          <p className="eyebrow eyebrow--small">
            <span className="eyebrow__line" />
            À propos
          </p>
          <h2 className="section-title section-title--small">Une voix, un siècle</h2>
          <p className="site-footer__text">
            Née à Charlemagne, au Québec, Céline Dion est l&apos;une des artistes
            les plus vendues de l&apos;histoire. De « Ce n&apos;était qu&apos;un
            rêve » à « Courage », cette page rassemble son répertoire et permet de
            l&apos;écouter sans quitter le navigateur.
          </p>
        </div>

        <div>
          <p className="eyebrow eyebrow--small">
            <span className="eyebrow__line" />
            Le lecteur
          </p>
          <ul className="site-footer__list">
            <li>Lecture des vidéos officielles via YouTube.</li>
            <li>File d&apos;attente, lecture aléatoire et répétition.</li>
            <li>Recherche par titre, album, langue et année.</li>
            <li>Aucun compte, aucun téléchargement.</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow eyebrow--small">
            <span className="eyebrow__line" />
            Catalogue
          </p>
          <ul className="site-footer__list">
            <li>
              <strong>{songCount}</strong> chansons disponibles
            </li>
            <li>
              <strong>{apiSongCount}</strong> entrées reçues de l&apos;API
            </li>
            <li>
              État de l&apos;API :{" "}
              <span className={`status-text status-text--${apiStatus}`}>
                {apiStatus === "online" ? "en ligne" : apiStatus === "checking" ? "vérification…" : "hors ligne (catalogue local)"}
              </span>
            </li>
          </ul>
          <p className="site-footer__fineprint">
            Les vidéos restent la propriété de leurs ayants droit. Cette page est
            une réalisation de fan, non officielle.
          </p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} — Hommage à Céline Dion</span>
        <span>celine-dion.it-sefako.com</span>
      </div>
    </footer>
  );
}
