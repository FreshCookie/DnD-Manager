import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { stopSound, getCurrentSound, isPlaying } from "./SoundManager";

const SoundControl = ({ theme }) => {
  const [hasSound, setHasSound] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHasSound(isPlaying());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!hasSound) return null;

  return (
    <button
      onClick={stopSound}
      className={`fixed top-4 right-4 ${theme.button} p-3 rounded-full shadow-lg transition-all hover:scale-110 z-50`}
      title="Sound stoppen"
    >
      <VolumeX className="w-6 h-6" />
    </button>
  );
};

export default SoundControl;
