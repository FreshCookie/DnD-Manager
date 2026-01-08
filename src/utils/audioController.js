let musicPlayerAudioRef = null;

export const setMusicPlayerRef = (ref) => {
  musicPlayerAudioRef = ref;
};

export const stopMusicPlayer = () => {
  if (musicPlayerAudioRef) {
    musicPlayerAudioRef.pause();
    musicPlayerAudioRef.currentTime = 0;
  }
};

export const getMusicPlayerRef = () => {
  return musicPlayerAudioRef;
};
