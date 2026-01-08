import React, { useState } from "react";
import { Dices } from "lucide-react";

const DiceRoller = ({ theme }) => {
  const [diceInput, setDiceInput] = useState("");
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState([]);

  const rollDice = () => {
    const match = diceInput.match(/(\d+)d(\d+)/i);
    if (!match) {
      alert("Bitte gib das Format ein: z.B. 2d20 oder 3d6");
      return;
    }

    const [, count, sides] = match;
    const diceCount = parseInt(count);
    const diceSides = parseInt(sides);

    setIsRolling(true);

    setTimeout(() => {
      const rolls = [];
      let total = 0;

      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(roll);
        total += roll;
      }

      const resultData = {
        input: diceInput,
        rolls,
        total,
        timestamp: new Date().toLocaleTimeString(),
      };

      setResult(resultData);
      setHistory([resultData, ...history.slice(0, 4)]);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Dices className={`${theme.accent} w-6 h-6`} />
        <h3 className={`${theme.text} text-xl font-bold`}>Würfel Roller</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={diceInput}
          onChange={(e) => setDiceInput(e.target.value)}
          placeholder="z.B. 2d20"
          className={`flex-1 px-4 py-2 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          onKeyPress={(e) => e.key === "Enter" && rollDice()}
        />
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`${theme.button} px-6 py-2 rounded-lg ${theme.text} font-semibold transition-all disabled:opacity-50`}
        >
          {isRolling ? "Würfelt..." : "Würfeln"}
        </button>
      </div>

      {isRolling && (
        <div className="flex justify-center items-center py-12 animate-bounce">
          <Dices className={`${theme.accent} w-24 h-24 animate-spin`} />
        </div>
      )}

      {result && !isRolling && (
        <div
          className={`${theme.border} border-2 rounded-lg p-6 text-center mb-4 animate-pulse`}
        >
          <div className={`${theme.accent} text-6xl font-bold mb-2`}>
            {result.total}
          </div>
          <div className={`${theme.text} text-sm opacity-70`}>
            Würfe: {result.rolls.join(" + ")}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h4 className={`${theme.text} text-sm font-semibold mb-2 opacity-70`}>
            Letzte Würfe:
          </h4>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className={`${theme.cardBg} ${theme.border} border rounded-lg p-2 flex justify-between text-sm`}
              >
                <span className={theme.text}>
                  {h.input}: {h.rolls.join(", ")}
                </span>
                <span className={`${theme.accent} font-bold`}>{h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
