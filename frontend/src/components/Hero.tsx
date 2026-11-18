import { PlayIcon, ArrowIcon } from "./Icons";

interface HeroProps {
  songCount: number;
  albumCount: number;
  firstYear: number | null;
  lastYear: number | null;
  featuredTitle: string;
  onPlayFeatured: () => void;
  onExplore: () => void;
}

export function Hero({
  songCount,
  albumCount,
  firstYear,
  lastYear,
  featuredTitle,
  onPlayFeatured,
  onExplore,
}: HeroProps) {
  const span = firstYear && lastYear ? lastYear - firstYear : null;

  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__line" />
            Discographie &amp; lecteur intégré
          </p>
          <h1 className="hero__title">
            Céline
            <span className="hero__title-accent">Dion</span>
          </h1>
          <p className="hero__lead">
            Toute la voix, toutes les émotions. Parcourez sa discographie et écoutez
            chaque chanson directement ici, dans un lecteur YouTube intégré.
          </p>

          <div className="hero__actions">
            <button type="button" className="button button--gold" onClick={onPlayFeatured}>
              <PlayIcon size={18} />
              Écouter « {featuredTitle} »
            </button>
            <button type="button" className="button button--ghost" onClick={onExplore}>
              Explorer les {songCount} chansons
              <ArrowIcon />
            </button>
          </div>

          <dl className="hero__stats">
            <div>
              <dt>Chansons</dt>
              <dd>{songCount}</dd>
            </div>
            <div>
              <dt>Albums</dt>
              <dd>{albumCount}</dd>
            </div>
            <div>
              <dt>Carrière</dt>
              <dd>{span ? `${span} ans` : "—"}</dd>
            </div>
            <div>
              <dt>Depuis</dt>
              <dd>{firstYear ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="vinyl">
            <div className="vinyl__grooves" />
            <div className="vinyl__label">
              <span>Céline</span>
              <span className="vinyl__label-sub">Dion</span>
            </div>
          </div>
          <div className="hero__card">
            <span className="hero__card-kicker">La voix du siècle</span>
            <span className="hero__card-title">5 octaves</span>
            <span className="hero__card-sub">Québec · Las Vegas · Paris</span>
          </div>
        </div>
      </div>
    </section>
  );
}
