import React, { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

const UNITS = [
  ["platinum", "Platin"],
  ["gold", "Gold"],
  ["silver", "Silber"],
  ["bronze", "Bronze"],
];

const blankEntry = () => ({ platinum: 0, gold: 0, silver: 0, bronze: 0, from: "" });

const summarize = (entry) => {
  const parts = UNITS.filter(([key]) => entry[key]).map(([key, label]) => `${entry[key]} ${label}`);
  return parts.length ? parts.join(", ") : "0";
};

const EntryForm = ({ draft, setDraft, onCommit, onCancel }) => (
  <div className="space-y-2 bg-gray-900/50 border border-amber-500/40 rounded-lg p-3">
    <div className="grid grid-cols-4 gap-2">
      {UNITS.map(([key, label]) => (
        <div key={key}>
          <div className="text-[9px] uppercase text-gray-500 mb-1 text-center">{label}</div>
          <input
            type="number"
            value={draft[key]}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
            className="w-full bg-gray-800 border border-purple-500/20 rounded px-1 py-1 text-sm text-center text-gray-100 outline-none"
          />
        </div>
      ))}
    </div>
    <input
      value={draft.from}
      onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
      onKeyDown={(e) => e.key === "Enter" && onCommit()}
      placeholder="Geliehen von… (optional)"
      className="w-full bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-sm text-gray-200 outline-none"
    />
    <div className="flex justify-end gap-3">
      <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-200">
        Abbrechen
      </button>
      <button
        onClick={onCommit}
        className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
      >
        <Check className="w-3.5 h-3.5" /> Übernehmen
      </button>
    </div>
  </div>
);

const normalize = (d) => ({
  platinum: parseInt(d.platinum, 10) || 0,
  gold: parseInt(d.gold, 10) || 0,
  silver: parseInt(d.silver, 10) || 0,
  bronze: parseInt(d.bronze, 10) || 0,
  from: (d.from || "").trim(),
});

const DebtList = ({ items, onChange }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(blankEntry());

  const startEdit = (idx) => {
    setAdding(false);
    setEditingIdx(idx);
    setDraft({ ...blankEntry(), ...items[idx] });
  };

  const commitEdit = (idx) => {
    const next = [...items];
    next[idx] = normalize(draft);
    onChange(next);
    setEditingIdx(null);
  };

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  const startAdd = () => {
    setEditingIdx(null);
    setDraft(blankEntry());
    setAdding(true);
  };

  const commitAdd = () => {
    onChange([...items, normalize(draft)]);
    setAdding(false);
    setDraft(blankEntry());
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) =>
        editingIdx === idx ? (
          <EntryForm
            key={idx}
            draft={draft}
            setDraft={setDraft}
            onCommit={() => commitEdit(idx)}
            onCancel={() => setEditingIdx(null)}
          />
        ) : (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 bg-gray-900/50 border border-purple-500/10 rounded-lg px-3 py-2"
          >
            <div className="min-w-0 text-sm">
              <span className="text-gray-200 font-semibold">{summarize(item)}</span>
              {item.from && <span className="text-gray-400"> – {item.from}</span>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => startEdit(idx)}
                className="text-gray-400 hover:text-amber-400"
                aria-label="Bearbeiten"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => remove(idx)}
                className="text-gray-500 hover:text-red-400"
                aria-label="Löschen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ),
      )}
      {adding ? (
        <EntryForm draft={draft} setDraft={setDraft} onCommit={commitAdd} onCancel={() => setAdding(false)} />
      ) : (
        <button
          onClick={startAdd}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
        >
          <Plus className="w-3.5 h-3.5" /> Schulden hinzufügen
        </button>
      )}
    </div>
  );
};

export default DebtList;
