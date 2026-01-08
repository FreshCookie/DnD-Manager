import React, { useRef, useEffect } from "react";

let globalAudioRef = null;
let currentSoundPath = null;

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

  // Spiele neuen Sound
  globalAudioRef.src = soundPath;
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
