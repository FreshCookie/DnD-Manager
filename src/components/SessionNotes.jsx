import React, { useState, useEffect } from "react";
import { FileText, Save } from "lucide-react";
import { useData } from "../contexts/DataContext";

const SessionNotes = ({ theme }) => {
  const { selectedStory, sessionTimes, setSessionTimes } = useData();
  const [notes, setNotes] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Lade Notizen wenn Story wechselt
  useEffect(() => {
    if (selectedStory?.id && sessionTimes[selectedStory.id]) {
      const savedNotes =
        typeof sessionTimes[selectedStory.id] === "object"
          ? sessionTimes[selectedStory.id].notes || ""
          : ""; // Falls alte Struktur (nur Zahl)
      setNotes(savedNotes);
    } else {
      setNotes("");
    }
  }, [selectedStory?.id]); // Nur wenn Story wechselt, nicht bei jedem sessionTimes Update

  // Auto-Save mit Debounce
  useEffect(() => {
    if (!selectedStory?.id) return;

    const timeoutId = setTimeout(() => {
      setSessionTimes((prev) => ({
        ...prev,
        [selectedStory.id]: {
          ...prev[selectedStory.id],
          notes: notes,
        },
      }));
    }, 2000); // Speichert 2 Sekunden nach letzter Änderung

    return () => clearTimeout(timeoutId);
  }, [notes, selectedStory?.id, setSessionTimes]); // sessionTimes NICHT in dependencies

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  if (!selectedStory) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 shadow-2xl`}
      >
        <div className="flex items-center gap-2 mb-2">
          <FileText className={`${theme.accent} w-5 h-5`} />
          <h3 className={`${theme.text} text-lg font-bold`}>Notizen</h3>
        </div>
        <p className={`${theme.text} text-sm opacity-70`}>
          Wähle eine Story aus
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-4 shadow-2xl w-full overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <FileText className={`${theme.accent} w-5 h-5`} />
          <h3 className={`${theme.text} text-base md:text-lg font-bold`}>
            Notizen
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${theme.button} px-3 py-1 md:px-3 md:py-1 rounded text-xs`}
        >
          {isExpanded ? "Minimieren" : "Erweitern"}
        </button>
      </div>

      <textarea
        value={notes}
        onChange={handleNotesChange}
        rows={isExpanded ? 15 : 6}
        className={`w-full px-3 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs resize-none`}
        placeholder="Session-Notizen..."
      />

      <p className={`${theme.text} text-xs opacity-50 mt-2`}>
        Auto-Save aktiviert · Story-spezifisch
      </p>
    </div>
  );
};

export default SessionNotes;
