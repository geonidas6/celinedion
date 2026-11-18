import { useCallback, useEffect, useRef, useState } from "react";
let apiPromise = null;
function loadIframeApi() {
    if (window.YT?.Player)
        return Promise.resolve();
    if (apiPromise)
        return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-youtube-api="true"]');
        const script = existing ?? document.createElement("script");
        const timeout = window.setTimeout(() => {
            reject(new Error("L'API YouTube n'a pas répondu."));
        }, 15000);
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            window.clearTimeout(timeout);
            previousCallback?.();
            resolve();
        };
        script.addEventListener("error", () => {
            window.clearTimeout(timeout);
            reject(new Error("Impossible de charger le lecteur YouTube."));
        });
        if (!existing) {
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            script.dataset.youtubeApi = "true";
            document.head.appendChild(script);
        }
    });
    return apiPromise;
}
function statusFromCode(code) {
    switch (code) {
        case 1:
            return "playing";
        case 2:
            return "paused";
        case 3:
            return "buffering";
        case 0:
            return "ended";
        case -1:
            return "loading";
        default:
            return "idle";
    }
}
const ERROR_MESSAGES = {
    2: "Cette vidéo ne peut pas être lue ici.",
    5: "La vidéo n'a pas pu être chargée par le lecteur HTML5.",
    100: "Cette vidéo est introuvable ou privée.",
    101: "Le propriétaire de cette vidéo interdit sa lecture intégrée.",
    150: "Le propriétaire de cette vidéo interdit sa lecture intégrée.",
};
export function useYouTubePlayer({ onEnded } = {}) {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const readyRef = useRef(false);
    const pendingRef = useRef(null);
    const endedCallback = useRef(onEnded);
    endedCallback.current = onEnded;
    const [status, setStatus] = useState("idle");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [muted, setMuted] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        let pollId = 0;
        const host = containerRef.current;
        loadIframeApi()
            .then(() => {
            if (cancelled || !host || playerRef.current)
                return;
            host.replaceChildren();
            const target = document.createElement("div");
            target.className = "screen__player-target";
            host.appendChild(target);
            playerRef.current = new window.YT.Player(target, {
                width: "100%",
                height: "100%",
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    disablekb: 0,
                    fs: 1,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    origin: window.location.origin,
                },
                events: {
                    onReady: () => {
                        if (cancelled)
                            return;
                        readyRef.current = true;
                        playerRef.current?.setVolume(volume);
                        const pending = pendingRef.current;
                        if (pending) {
                            pendingRef.current = null;
                            if (pending.autoplay) {
                                playerRef.current?.loadVideoById({ videoId: pending.youtubeId });
                            }
                            else {
                                playerRef.current?.cueVideoById({ videoId: pending.youtubeId });
                            }
                        }
                        else {
                            setStatus("idle");
                        }
                    },
                    onStateChange: (event) => {
                        if (cancelled)
                            return;
                        const next = statusFromCode(event.data);
                        setStatus(next);
                        if (next === "ended") {
                            endedCallback.current?.();
                        }
                        if (next === "playing") {
                            setError(null);
                            setDuration(playerRef.current?.getDuration() ?? 0);
                        }
                    },
                    onError: (event) => {
                        if (cancelled)
                            return;
                        setStatus("error");
                        setError(ERROR_MESSAGES[event.data] ?? "Lecture YouTube indisponible.");
                    },
                },
            });
        })
            .catch((apiError) => {
            if (cancelled)
                return;
            setStatus("error");
            setError(apiError instanceof Error ? apiError.message : "Lecteur YouTube indisponible.");
        });
        pollId = window.setInterval(() => {
            const player = playerRef.current;
            if (!player || typeof player.getCurrentTime !== "function")
                return;
            const time = player.getCurrentTime();
            const total = player.getDuration();
            if (Number.isFinite(time))
                setCurrentTime(time);
            if (Number.isFinite(total) && total > 0)
                setDuration(total);
        }, 500);
        return () => {
            cancelled = true;
            window.clearInterval(pollId);
            const player = playerRef.current;
            playerRef.current = null;
            readyRef.current = false;
            pendingRef.current = null;
            if (player && typeof player.destroy === "function")
                player.destroy();
            host?.replaceChildren();
        };
        // The volume at mount time is intentional; later changes go through changeVolume.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const load = useCallback((youtubeId, autoplay = true) => {
        setError(null);
        setCurrentTime(0);
        setDuration(0);
        setStatus("loading");
        const player = playerRef.current;
        if (!player || !readyRef.current) {
            pendingRef.current = { youtubeId, autoplay };
            return;
        }
        if (autoplay) {
            player.loadVideoById({ videoId: youtubeId });
        }
        else {
            player.cueVideoById({ videoId: youtubeId });
        }
    }, []);
    const play = useCallback(() => {
        playerRef.current?.playVideo();
    }, []);
    const pause = useCallback(() => {
        playerRef.current?.pauseVideo();
    }, []);
    const toggle = useCallback(() => {
        const player = playerRef.current;
        if (!player)
            return;
        const state = player.getPlayerState();
        if (state === 1)
            player.pauseVideo();
        else
            player.playVideo();
    }, []);
    const seek = useCallback((seconds) => {
        playerRef.current?.seekTo(seconds, true);
        setCurrentTime(seconds);
    }, []);
    const changeVolume = useCallback((nextVolume) => {
        const clamped = Math.max(0, Math.min(100, Math.round(nextVolume)));
        setVolume(clamped);
        playerRef.current?.setVolume(clamped);
        if (clamped > 0) {
            playerRef.current?.unMute();
            setMuted(false);
        }
    }, []);
    const toggleMute = useCallback(() => {
        setMuted((current) => {
            if (current)
                playerRef.current?.unMute();
            else
                playerRef.current?.mute();
            return !current;
        });
    }, []);
    return {
        containerRef,
        status,
        currentTime,
        duration,
        volume,
        muted,
        error,
        load,
        play,
        pause,
        toggle,
        seek,
        changeVolume,
        toggleMute,
    };
}
