import React, { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, Square, CheckCircle } from "lucide-react";
import { formatTime } from "../utils/helpers";
import { useData } from "../contexts/DataContext";

const SessionTimer = ({ theme, storyId }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const intervalRef = useRef(null);
  const hasLoadedInitialTime = useRef(false);
  const {
    stories,
    setStories,
    selectedStory,
    setSelectedStory,
    sessionTimes,
    setSessionTimes,
  } = useData();

  // Lade Zeit nur EINMAL beim Mount oder Story-Wechsel
  useEffect(() => {
    if (sessionTimes[storyId] && !hasLoadedInitialTime.current) {
      const savedTime =
        typeof sessionTimes[storyId] === "number"
          ? sessionTimes[storyId]
          : sessionTimes[storyId].totalTime || 0;
      setSeconds(savedTime);
      hasLoadedInitialTime.current = true;
    }

    // Reset flag wenn Story wechselt
    return () => {
      hasLoadedInitialTime.current = false;
    };
  }, [storyId]); // NUR storyId, NICHT sessionTimes!

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newTime = prev + 1;
          // Speichere in sessionTimes als Objekt
          setSessionTimes((prevTimes) => ({
            ...prevTimes,
            [storyId]: {
              totalTime: newTime,
              notes: prevTimes[storyId]?.notes || "",
            },
          }));
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Speichere Zeit auch beim Pausieren
      if (seconds > 0) {
        setSessionTimes((prevTimes) => ({
          ...prevTimes,
          [storyId]: {
            totalTime: seconds,
            notes: prevTimes[storyId]?.notes || "",
          },
        }));
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, storyId, seconds, setSessionTimes]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
    setIsRunning(false);
    if (seconds > 0) {
      setShowCompleteDialog(true);
    }
  };

  const handleComplete = () => {
    // Finde die Story und markiere sie als abgeschlossen
    const updatedStories = stories.map((s) => {
      if (s.id === storyId) {
        return {
          ...s,
          status: "completed",
          completionTime: seconds,
        };
      }
      return s;
    });

    setStories(updatedStories);

    // Update auch die selectedStory wenn es die aktuelle ist
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory({
        ...selectedStory,
        status: "completed",
        completionTime: seconds,
      });
    }

    // Lösche Timer aus sessionTimes
    setSessionTimes((prevTimes) => {
      const newTimes = { ...prevTimes };
      delete newTimes[storyId];
      return newTimes;
    });

    setShowCompleteDialog(false);
    setSeconds(0);
    hasLoadedInitialTime.current = false;
  };

  const handleCancel = () => {
    setShowCompleteDialog(false);
    // Timer bleibt gespeichert!
  };

  return (
    <>
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-xl font-bold`}>Session Timer</h3>
        </div>

        <div className={`text-center mb-6`}>
          <div className={`${theme.accent} text-5xl font-bold font-mono`}>
            {formatTime(seconds)}
          </div>
          {!isRunning && seconds > 0 && (
            <p className={`${theme.text} text-xs opacity-50 mt-2`}>
              Pausiert - wird beim nächsten Start fortgesetzt
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`${theme.button} px-6 py-3 rounded-lg ${theme.text} font-semibold transition-all disabled:opacity-50 flex items-center gap-2`}
          >
            <Play className="w-5 h-5" />{" "}
            {seconds > 0 && !isRunning ? "Fortsetzen" : "Start"}
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className={`${theme.button} px-6 py-3 rounded-lg ${theme.text} font-semibold transition-all disabled:opacity-50 flex items-center gap-2`}
          >
            <Pause className="w-5 h-5" /> Pause
          </button>
          <button
            onClick={handleStop}
            disabled={seconds === 0}
            className={`bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg ${theme.text} font-semibold transition-all disabled:opacity-50 flex items-center gap-2`}
          >
            <Square className="w-5 h-5" /> Abschließen
          </button>
        </div>
      </div>

      {/* Abschluss Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-8 max-w-md w-full shadow-2xl`}
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className={`${theme.accent} w-8 h-8`} />
              <h3 className={`${theme.text} text-2xl font-bold`}>
                Story abschließen?
              </h3>
            </div>

            <p className={`${theme.text} mb-4`}>
              Möchtest du diese Story als abgeschlossen markieren?
            </p>

            <div
              className={`${theme.cardBg} ${theme.border} border rounded-lg p-4 mb-6 text-center`}
            >
              <div className={`${theme.text} text-sm opacity-70 mb-2`}>
                Gesamtzeit:
              </div>
              <div className={`${theme.accent} text-3xl font-bold font-mono`}>
                {formatTime(seconds)}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
              >
                Ja, abschließen
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Später weiterspielen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionTimer;
