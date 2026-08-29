import React, { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

const TYPES = ["Fähigkeit", "Zaubertrick", "Zauber"];

const blankEntry = () => ({ name: "", type: "Fähigkeit", description: "", cost: "" });

const EntryForm = ({ draft, setDraft, onCommit, onCancel }) => (
  <div className="space-y-2 bg-gray-900/50 border border-amber-500/40 rounded-lg p-3">
    <div className="flex gap-2">
      <select
        value={draft.type}
        onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
        className="bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-xs text-gray-200 outline-none shrink-0"
      >
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        autoFocus
        value={draft.name}
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        onKeyDown={(e) => e.key === "Enter" && onCommit()}
        placeholder="Name"
        className="flex-1 min-w-0 bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-sm text-gray-100 outline-none"
      />
    </div>
    <input
      value={draft.cost}
      onChange={(e) => setDraft((d) => ({ ...d, cost: e.target.value }))}
      onKeyDown={(e) => e.key === "Enter" && onCommit()}
      placeholder="Kosten/Effekt, z.B. 1 Aktion, Examination + LVL"
      className="w-full bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-xs text-gray-300 outline-none"
    />
    <textarea
      value={draft.description}
      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
      placeholder="Kurzbeschreibung…"
      rows={2}
      className="w-full bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-xs text-gray-300 outline-none resize-y"
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

const AbilityList = ({ items, onChange }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(blankEntry());

  const startEdit = (idx) => {
    setAdding(false);
    setEditingIdx(idx);
    setDraft({ ...blankEntry(), ...items[idx] });
  };

  const commitEdit = (idx) => {
    const name = draft.name.trim();
    if (!name) return;
    const next = [...items];
    next[idx] = { ...draft, name };
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
    const name = draft.name.trim();
    if (!name) return;
    onChange([...items, { ...draft, name }]);
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
            className="bg-gray-900/50 border border-purple-500/10 rounded-lg px-3 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-purple-300 bg-purple-900/30 rounded px-1.5 py-0.5 shrink-0">
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-200 font-semibold">{item.name}</span>
                  {item.cost && (
                    <span className="text-[10px] text-amber-400/80">{item.cost}</span>
                  )}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">
                    {item.description}
                  </div>
                )}
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
          </div>
        ),
      )}
      {adding ? (
        <EntryForm
          draft={draft}
          setDraft={setDraft}
          onCommit={commitAdd}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={startAdd}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
        >
          <Plus className="w-3.5 h-3.5" /> Fähigkeit/Zaubertrick/Zauber hinzufügen
        </button>
      )}
    </div>
  );
};

export default AbilityList;
