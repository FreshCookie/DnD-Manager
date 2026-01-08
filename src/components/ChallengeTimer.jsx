import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, Square, Plus } from "lucide-react";
import { useData } from "../contexts/DataContext";

const ChallengeTimer = ({ theme }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    minutes: 5,
  });
  const intervalRef = useRef(null);
  //const audioRef = useRef(null);
  const { sendToPlayerView } = useData();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // Update Player View
          sendToPlayerView({
            type: "challenge",
            data: {
              ...challenge,
              timeLeft: newTime,
              isRunning: true,
            },
          });

          // Zeit abgelaufen
          if (newTime === 0) {
            playAlarm();
            setIsRunning(false);
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, challenge, sendToPlayerView]);

  const playAlarm = () => {
    // Einfacher Beep-Sound (kann durch echte Audio-Datei ersetzt werden)
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 1);
  };

  const handleCreateChallenge = () => {
    if (!formData.title.trim()) {
      alert("Bitte gib einen Titel ein!");
      return;
    }

    const newChallenge = {
      title: formData.title,
      description: formData.description,
      totalTime: formData.minutes * 60,
    };

    setChallenge(newChallenge);
    setTimeLeft(formData.minutes * 60);
    setIsCreating(false);

    // Sende Challenge an Player View
    sendToPlayerView({
      type: "challenge",
      data: {
        ...newChallenge,
        timeLeft: formData.minutes * 60,
        isRunning: false,
      },
    });
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    sendToPlayerView({
      type: "challenge",
      data: {
        ...challenge,
        timeLeft: timeLeft,
        isRunning: false,
      },
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setChallenge(null);
    setTimeLeft(0);
    sendToPlayerView({
      type: "challenge",
      data: null,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Timer className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-xl font-bold`}>Challenge Timer</h3>
        </div>
        {!challenge && (
          <button
            onClick={() => setIsCreating(true)}
            className={`${theme.button} px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105`}
          >
            <Plus className="w-4 h-4" /> Challenge erstellen
          </button>
        )}
      </div>

      {isCreating && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 mb-4`}
        >
          <div className="space-y-3">
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="z.B. Zeichnet das Wappen"
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Zusätzliche Infos..."
              />
            </div>
            <div>
              <label
                className={`${theme.text} block mb-2 text-sm font-semibold`}
              >
                Zeit (Minuten)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minutes: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateChallenge}
                className={`${theme.button} flex-1 px-4 py-2 rounded-lg text-sm font-semibold`}
              >
                Erstellen
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ title: "", description: "", minutes: 5 });
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {challenge && (
        <div>
          <div
            className={`${theme.cardBg} ${theme.border} border rounded-lg p-4 mb-4`}
          >
            <h4 className={`${theme.text} font-bold mb-2`}>
              {challenge.title}
            </h4>
            {challenge.description && (
              <p className={`${theme.text} text-sm opacity-70 mb-3`}>
                {challenge.description}
              </p>
            )}
            <div className={`text-center mb-4`}>
              <div
                className={`${
                  timeLeft <= 10 && timeLeft > 0
                    ? "text-red-400 animate-pulse"
                    : theme.accent
                } text-4xl font-bold font-mono`}
              >
                {formatTime(timeLeft)}
              </div>
              {timeLeft === 0 && (
                <div className="text-red-400 text-lg font-bold mt-2 animate-pulse">
                  ZEIT ABGELAUFEN!
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleStart}
              disabled={isRunning || timeLeft === 0}
              className={`${theme.button} flex-1 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              <Play className="w-4 h-4" /> Start
            </button>
            <button
              onClick={handlePause}
              disabled={!isRunning}
              className={`${theme.button} flex-1 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          </div>
        </div>
      )}

      {!challenge && !isCreating && (
        <div className={`${theme.text} text-center py-6 opacity-50 text-sm`}>
          Erstelle eine Challenge für deine Spieler
        </div>
      )}
    </div>
  );
};

export default ChallengeTimer;
