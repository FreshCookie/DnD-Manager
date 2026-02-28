import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { stopSound as stopLocationSound } from "./SoundManager";
import { setMusicPlayerRef } from "../utils/audioController";

const MusicPlayer = ({ theme }) => {
  const [playlists] = useState({
    combat: [
      { name: "Epic Battle", file: "/music/combat/Kampf.mp3" },
      { name: "Boss Fight", file: "/music/combat/Plötzlicher Kampf.mp3" },
    ],
    ambient: [
      { name: "Village", file: "/music/ambient/Neutral.mp3" },
      { name: "Forest", file: "/music/ambient/Mysteriöser Wald.mp3" },
      { name: "Festival", file: "/music/ambient/Festival.mp3" },
      { name: "Dramatic", file: "/music/ambient/Dramatic.mp3" },
    ],
    tavern: [{ name: "Tavern Music", file: "/music/tavern/Taverne.mp3" }],
    market: [{ name: "Market", file: "/music/market/Markt.mp3" }],
  });

  const [currentCategory, setCurrentCategory] = useState("ambient");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      setMusicPlayerRef(audioRef.current); // Diese Zeile hinzufügen
    }
  }, [volume, isMuted]);

  const playTrack = (track) => {
    // Stoppe Location/NPC Sounds
    stopLocationSound();

    if (currentTrack?.file === track.file && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.file;
        audioRef.current
          .play()
          .catch((err) => console.log("Playback error:", err));
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Music className={`${theme.accent} w-6 h-6`} />
        <h3 className={`${theme.text} text-lg md:text-xl font-bold`}>
          Music Player
        </h3>
      </div>

      <audio ref={audioRef} loop onEnded={() => setIsPlaying(false)} />

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(playlists).map((category) => (
          <button
            key={category}
            onClick={() => setCurrentCategory(category)}
            className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-sm ${
              currentCategory === category
                ? theme.button
                : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70 hover:opacity-100`
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {playlists[currentCategory].map((track, idx) => (
          <div
            key={idx}
            onClick={() => playTrack(track)}
            className={`${theme.cardBg} ${
              theme.border
            } border rounded-lg p-3 cursor-pointer transition-all hover:scale-105 flex items-center justify-between ${
              currentTrack?.file === track.file ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <span className={theme.text}>{track.name}</span>
            {currentTrack?.file === track.file && isPlaying && (
              <Play className={`${theme.accent} w-5 h-5 animate-pulse`} />
            )}
          </div>
        ))}
      </div>

      {currentTrack && (
        <div
          className={`${theme.border} border-t-2 pt-4 flex items-center gap-4`}
        >
          <button
            onClick={togglePlayPause}
            className={`${theme.button} p-3 rounded-lg transition-all hover:scale-110`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1">
            <div className={`${theme.text} text-sm font-semibold mb-1`}>
              {currentTrack.name}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`${theme.text} opacity-70 hover:opacity-100`}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
