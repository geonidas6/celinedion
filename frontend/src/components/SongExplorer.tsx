import type { Language, Song, SortMode } from "../api/types";
import { PlayIcon, SearchIcon, ShuffleIcon } from "./Icons";
import { SongCard } from "./SongCard";

interface SongExplorerProps {
  songs: Song[];
  totalCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  language: Language | "all";
  onLanguageChange: (value: Language | "all") => void;
  album: string;
  albums: { album: string; year: number | null }[];
  onAlbumChange: (value: string) => void;
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  currentId: string | null;
  isPlaying: boolean;
  onSelect: (song: Song) => void;
  onPlayAll: () => void;
  onShuffleAll: () => void;
}

export function SongExplorer({
  songs,
  totalCount,
  query,
  onQueryChange,
  language,
  onLanguageChange,
  album,
  albums,
  onAlbumChange,
  sort,
  onSortChange,
  currentId,
  isPlaying,
  onSelect,
  onPlayAll,
  onShuffleAll,
}: SongExplorerProps) {
  return (
    <section className="explorer" id="discographie" aria-labelledby="explorer-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <span className="eyebrow__line" />
            Discographie complète
          </p>
          <h2 id="explorer-title" className="section-title">
            Toutes ses chansons
          </h2>
        </div>
        <div className="section-head__actions">
          <button
            type="button"
            className="button button--gold button--small"
            onClick={onPlayAll}
            disabled={songs.length === 0}
          >
            <PlayIcon size={16} />
            Tout lire
          </button>
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={onShuffleAll}
            disabled={songs.length === 0}
          >
            <ShuffleIcon size={16} />
            Aléatoire
          </button>
        </div>
      </div>

      <div className="toolbar">
        <label className="search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher une chanson, un album…"
            aria-label="Rechercher une chanson ou un album"
          />
        </label>

        <div className="chips" role="group" aria-label="Langue des chansons">
          {(
            [
              ["all", "Tout"],
              ["fr", "Français"],
              ["en", "English"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`chip${language === value ? " chip--active" : ""}`}
              onClick={() => onLanguageChange(value)}
              aria-pressed={language === value}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="select">
          <span>Album</span>
          <select value={album} onChange={(event) => onAlbumChange(event.target.value)}>
            <option value="all">Tous les albums</option>
            {albums.map((item) => (
              <option key={item.album} value={item.album}>
                {item.album}
                {item.year ? ` (${item.year})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span>Trier</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as SortMode)}>
            <option value="year-desc">Plus récent</option>
            <option value="year-asc">Plus ancien</option>
            <option value="title-asc">Titre A–Z</option>
            <option value="album-asc">Album A–Z</option>
          </select>
        </label>
      </div>

      <p className="results-line" aria-live="polite">
        <strong>{songs.length}</strong> chanson{songs.length > 1 ? "s" : ""} affichée
        {songs.length > 1 ? "s" : ""}
        {songs.length !== totalCount ? ` sur ${totalCount}` : ""}
        {query ? ` pour « ${query} »` : ""}
      </p>

      {songs.length === 0 ? (
        <div className="empty">
          <p>Aucune chanson ne correspond à ces filtres.</p>
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={() => {
              onQueryChange("");
              onLanguageChange("all");
              onAlbumChange("all");
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <ul className="song-grid">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isCurrent={song.id === currentId}
              isPlaying={song.id === currentId && isPlaying}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
