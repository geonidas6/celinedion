import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "./api/client";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PlayerDock } from "./components/PlayerDock";
import { SongExplorer } from "./components/SongExplorer";
import { Stage } from "./components/Stage";
import { LOCAL_CATALOG } from "./data/catalog";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { filterAndSort, fromDto, mergeCatalogs, uniqueAlbums, youtubeThumbnail, } from "./lib/catalog";
const FEATURED_TITLE = "My Heart Will Go On";
export default function App() {
    const [songs, setSongs] = useState(LOCAL_CATALOG);
    const [apiStatus, setApiStatus] = useState("checking");
    const [apiSongCount, setApiSongCount] = useState(0);
    const [query, setQuery] = useState("");
    const [language, setLanguage] = useState("all");
    const [album, setAlbum] = useState("all");
    const [sort, setSort] = useState("year-desc");
    const [queue, setQueue] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState("off");
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);
    const visibleSongs = useMemo(() => filterAndSort(songs, query, language, album, sort), [songs, query, language, album, sort]);
    const albums = useMemo(() => uniqueAlbums(songs), [songs]);
    const currentSong = useMemo(() => songs.find((song) => song.id === currentId) ?? null, [songs, currentId]);
    const queueSongs = useMemo(() => {
        const byId = new Map(songs.map((song) => [song.id, song]));
        return queue.map((id) => byId.get(id)).filter((song) => Boolean(song));
    }, [queue, songs]);
    const currentIndex = currentId ? queue.indexOf(currentId) : -1;
    const upcoming = currentIndex >= 0 ? queueSongs.slice(currentIndex + 1) : queueSongs.filter((s) => s.id !== currentId);
    const announce = useCallback((message) => {
        setToast(message);
        if (toastTimer.current)
            window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 3200);
    }, []);
    useEffect(() => {
        return () => {
            if (toastTimer.current)
                window.clearTimeout(toastTimer.current);
        };
    }, []);
    const nextRef = useRef(() => { });
    const player = useYouTubePlayer({
        onEnded: () => {
            if (repeat === "one") {
                player.seek(0);
                player.play();
                return;
            }
            nextRef.current(true);
        },
    });
    const { load, play, pause, toggle, seek, changeVolume, toggleMute } = player;
    const startSong = useCallback((song, options) => {
        const baseQueue = options?.queue?.length
            ? options.queue
            : queue.includes(song.id)
                ? queueSongs
                : visibleSongs.some((item) => item.id === song.id)
                    ? visibleSongs
                    : [...queueSongs, song];
        const ids = baseQueue.map((item) => item.id);
        if (!ids.includes(song.id))
            ids.push(song.id);
        setQueue(ids);
        setCurrentId(song.id);
        load(song.youtubeId, true);
        if (options?.announce !== false)
            announce(`Lecture : ${song.title}`);
    }, [announce, load, queue, queueSongs, visibleSongs]);
    const startQueue = useCallback((list, random = false) => {
        if (list.length === 0)
            return;
        const pool = random ? shuffleArray(list) : list;
        startSong(pool[0], { queue: pool });
    }, [startSong]);
    const next = useCallback((auto = false) => {
        if (queueSongs.length === 0)
            return;
        const index = currentIndex;
        if (index === -1) {
            startSong(queueSongs[0], { queue: queueSongs });
            return;
        }
        let target;
        if (shuffle && queueSongs.length > 1) {
            const others = queueSongs.filter((song) => song.id !== currentId);
            target = others[Math.floor(Math.random() * others.length)];
        }
        else {
            target = queueSongs[index + 1];
        }
        if (!target) {
            if (repeat === "all" || !auto) {
                target = queueSongs[0];
            }
            else {
                return;
            }
        }
        startSong(target, { queue: queueSongs, announce: false });
    }, [currentId, currentIndex, queueSongs, repeat, shuffle, startSong]);
    nextRef.current = next;
    const previous = useCallback(() => {
        if (player.currentTime > 5) {
            seek(0);
            return;
        }
        if (queueSongs.length === 0)
            return;
        const index = currentIndex;
        const target = index > 0 ? queueSongs[index - 1] : queueSongs[queueSongs.length - 1];
        if (target)
            startSong(target, { queue: queueSongs, announce: false });
    }, [currentIndex, player.currentTime, queueSongs, seek, startSong]);
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const health = await apiClient.getHealth({ signal: controller.signal });
                setApiStatus(health.status === "ok" ? "online" : "offline");
            }
            catch {
                if (!controller.signal.aborted)
                    setApiStatus("offline");
                return;
            }
            try {
                const dtoSongs = await apiClient.getSongs({ signal: controller.signal });
                if (controller.signal.aborted)
                    return;
                const merged = mergeCatalogs(dtoSongs.map(fromDto), LOCAL_CATALOG);
                setSongs(merged.songs);
                setApiSongCount(dtoSongs.length);
            }
            catch {
                // Keep the verified local catalogue when the songs endpoint is unavailable.
            }
        })();
        return () => controller.abort();
    }, []);
    useEffect(() => {
        if (!currentSong || !("mediaSession" in navigator))
            return;
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: "Céline Dion",
                album: currentSong.album ?? "",
                artwork: [
                    { src: youtubeThumbnail(currentSong.youtubeId, "hq"), sizes: "480x360", type: "image/jpeg" },
                ],
            });
            navigator.mediaSession.setActionHandler("play", () => play());
            navigator.mediaSession.setActionHandler("pause", () => pause());
            navigator.mediaSession.setActionHandler("nexttrack", () => nextRef.current(false));
            navigator.mediaSession.setActionHandler("previoustrack", () => previous());
        }
        catch {
            // Media Session is optional; ignore unsupported browsers.
        }
    }, [currentSong, pause, play, previous]);
    useEffect(() => {
        const onKeyDown = (event) => {
            const target = event.target;
            if (target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.tagName === "BUTTON" ||
                    target.tagName === "A" ||
                    target.isContentEditable)) {
                return;
            }
            if (event.code === "Space" && currentId) {
                event.preventDefault();
                toggle();
            }
            if (event.code === "ArrowRight" && currentId) {
                seek(Math.min(player.currentTime + 10, player.duration || player.currentTime + 10));
            }
            if (event.code === "ArrowLeft" && currentId) {
                seek(Math.max(0, player.currentTime - 10));
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [currentId, player.currentTime, player.duration, seek, toggle]);
    const featured = useMemo(() => songs.find((song) => song.title === FEATURED_TITLE) ?? visibleSongs[0] ?? songs[0], [songs, visibleSongs]);
    const isPlaying = player.status === "playing" || player.status === "buffering";
    const totalDuration = useMemo(() => songs.reduce((total, song) => total + (song.duration ?? 0), 0), [songs]);
    const years = songs.map((song) => song.year).filter((year) => year != null);
    const firstYear = years.length ? Math.min(...years) : null;
    const lastYear = years.length ? Math.max(...years) : null;
    const scrollToScene = () => {
        document.getElementById("scene")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToDiscography = () => {
        document.getElementById("discographie")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const cycleRepeat = () => {
        setRepeat((mode) => (mode === "off" ? "all" : mode === "all" ? "one" : "off"));
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, { apiStatus: apiStatus }), _jsxs("main", { children: [_jsx(Hero, { songCount: songs.length, albumCount: albums.length, firstYear: firstYear, lastYear: lastYear, featuredTitle: featured?.title ?? "My Heart Will Go On", onPlayFeatured: () => featured && startSong(featured, { queue: visibleSongs.length ? visibleSongs : songs }), onExplore: scrollToDiscography }), _jsx(Stage, { current: currentSong, upcoming: upcoming, status: player.status, error: player.error, isPlaying: isPlaying, playerMountRef: player.containerRef, onToggle: toggle, onRetry: () => currentSong && startSong(currentSong, { queue: queueSongs, announce: false }), onSelect: (song) => startSong(song, { queue: queueSongs.length ? queueSongs : undefined }) }), _jsx(SongExplorer, { songs: visibleSongs, totalCount: songs.length, query: query, onQueryChange: setQuery, language: language, onLanguageChange: setLanguage, album: album, albums: albums, onAlbumChange: setAlbum, sort: sort, onSortChange: setSort, currentId: currentId, isPlaying: isPlaying, onSelect: (song) => startSong(song), onPlayAll: () => startQueue(visibleSongs), onShuffleAll: () => {
                            setShuffle(true);
                            startQueue(visibleSongs, true);
                        } }), _jsx("section", { className: "marquee", "aria-hidden": "true", children: _jsxs("div", { className: "marquee__track", children: [_jsx("span", { children: "Courage" }), _jsx("span", { children: "Pour que tu m'aimes encore" }), _jsx("span", { children: "My Heart Will Go On" }), _jsx("span", { children: "Encore un soir" }), _jsx("span", { children: "Parler \u00E0 mon p\u00E8re" }), _jsx("span", { children: "I'm Alive" }), _jsx("span", { children: "The Power of Love" }), _jsx("span", { children: "S'il suffisait d'aimer" })] }) }), _jsxs("section", { className: "facts", "aria-label": "Le catalogue en chiffres", children: [_jsxs("div", { className: "fact", children: [_jsx("span", { className: "fact__value", children: songs.length }), _jsx("span", { className: "fact__label", children: "chansons en \u00E9coute imm\u00E9diate" })] }), _jsxs("div", { className: "fact", children: [_jsx("span", { className: "fact__value", children: albums.length }), _jsx("span", { className: "fact__label", children: "albums et compilations" })] }), _jsxs("div", { className: "fact", children: [_jsx("span", { className: "fact__value", children: totalDuration > 0 ? `${Math.floor(totalDuration / 3600)} h` : "—" }), _jsx("span", { className: "fact__label", children: "de musique au catalogue" })] }), _jsxs("div", { className: "fact", children: [_jsx("span", { className: "fact__value", children: "1" }), _jsx("span", { className: "fact__label", children: "lecteur YouTube int\u00E9gr\u00E9" })] })] })] }), _jsx(Footer, { apiStatus: apiStatus, songCount: songs.length, apiSongCount: apiSongCount }), currentSong ? (_jsx(PlayerDock, { current: currentSong, isPlaying: isPlaying, currentTime: player.currentTime, duration: player.duration, queuePosition: { index: Math.max(currentIndex, 0), total: Math.max(queueSongs.length, 1) }, shuffle: shuffle, repeat: repeat, volume: player.volume, muted: player.muted, onToggle: toggle, onPrev: previous, onNext: () => next(false), onToggleShuffle: () => setShuffle((value) => !value), onCycleRepeat: cycleRepeat, onVolumeChange: changeVolume, onToggleMute: toggleMute, onOpenScene: scrollToScene, onSeek: seek })) : null, _jsx("div", { className: `toast${toast ? " toast--visible" : ""}`, role: "status", "aria-live": "polite", children: toast ?? "" })] }));
}
function shuffleArray(items) {
    const out = [...items];
    for (let index = out.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        [out[index], out[swap]] = [out[swap], out[index]];
    }
    return out;
}
