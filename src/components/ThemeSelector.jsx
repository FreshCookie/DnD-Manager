import React, { useEffect } from "react";
import { Palette } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { themes } from "../styles/themes";

const ThemeSelector = ({ theme }) => {
  const { setTheme, theme: currentTheme, sendToPlayerView } = useData();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Sende Theme an Player View
    sendToPlayerView({
      type: "theme",
      theme: newTheme,
    });
  };

  // Sende aktuelles Theme beim Laden
  useEffect(() => {
    sendToPlayerView({
      type: "theme",
      theme: currentTheme,
    });
  }, []);

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 md:p-6 shadow-2xl w-full overflow-hidden`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Palette className={`${theme.accent} w-6 h-6`} />
        <h3 className={`${theme.text} text-lg md:text-xl font-bold`}>Theme</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 w-full">
        {Object.entries(themes).map(([key, t]) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className={`${t.cardBg} ${
              t.border
            } border-2 rounded-lg p-3 md:p-4 transition-all hover:scale-105 ${
              currentTheme === key ? "ring-2 ring-white" : ""
            }`}
          >
            <div className={t.text + " font-semibold mb-2 text-xs md:text-sm"}>
              {t.name}
            </div>
            <div className="flex gap-2">
              <div className={`${t.bg} w-full h-6 md:h-8 rounded`}></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
