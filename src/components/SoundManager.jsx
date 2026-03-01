import React, { useRef, useEffect } from "react";

let globalAudioRef = null;
let currentSoundPath = null;
const audioCache = {}; // Cache für geladene Audios

const SoundManager = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    globalAudioRef = audioRef.current;
  }, []);

  return <audio ref={audioRef} />;
};

export const playSound = (soundPath) => {
  if (!soundPath || !globalAudioRef) return;

  // Stoppe aktuellen Sound
  globalAudioRef.pause();
  globalAudioRef.currentTime = 0;

  // Nutze gecachtes Audio falls vorhanden, sonst lade neu
  if (audioCache[soundPath]) {
    console.log("🎵 Using cached audio:", soundPath);
    globalAudioRef.src = audioCache[soundPath].src;
  } else {
    console.log("🎵 Loading new audio:", soundPath);
    globalAudioRef.src = soundPath;
    // Audio im Cache speichern für zukünftige Verwendung
    const cachedAudio = new Audio();
    cachedAudio.src = soundPath;
    cachedAudio.load();
    audioCache[soundPath] = cachedAudio;
  }

  // Spiele Sound
  globalAudioRef.loop = true;
  globalAudioRef.volume = 0.5;
  globalAudioRef.play().catch((err) => {
    console.log("Sound konnte nicht abgespielt werden:", err);
  });

  currentSoundPath = soundPath;
};

export const stopSound = () => {
  if (!globalAudioRef) return;
  globalAudioRef.pause();
  globalAudioRef.currentTime = 0;
  currentSoundPath = null;
};

export const getCurrentSound = () => {
  return currentSoundPath;
};

export const isPlaying = () => {
  return globalAudioRef && !globalAudioRef.paused;
};

export default SoundManager;
