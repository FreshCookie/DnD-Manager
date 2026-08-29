import React, { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

const CATEGORIES = ["Waffe", "Rüstung", "Schild", "Sonstiges"];

const blankEntry = () => ({ category: "Waffe", name: "", stat: "", description: "" });

const EntryForm = ({ draft, setDraft, onCommit, onCancel }) => (
  <div className="space-y-2 bg-gray-900/50 border border-amber-500/40 rounded-lg p-3">
    <div className="flex gap-2">
      <select
        value={draft.category}
        onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
        className="bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-xs text-gray-200 outline-none shrink-0"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        autoFocus
        value={draft.name}
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        onKeyDown={(e) => e.key === "Enter" && onCommit()}
        placeholder="Name (Pflicht)"
        className="flex-1 min-w-0 bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-sm text-gray-100 outline-none"
      />
    </div>
    <input
      value={draft.stat}
      onChange={(e) => setDraft((d) => ({ ...d, stat: e.target.value }))}
      onKeyDown={(e) => e.key === "Enter" && onCommit()}
      placeholder="Stats, z.B. 1D4 + Dex (optional)"
      className="w-full bg-gray-800 border border-purple-500/20 rounded px-2 py-1 text-xs text-gray-300 outline-none"
    />
    <textarea
      value={draft.description}
      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
      placeholder="Beschreibung, z.B. Besonderheiten, Flüche… (optional)"
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

const Entry = ({ item, onEdit, onRemove }) => (
  <div className="bg-gray-900/50 border border-purple-500/10 rounded-lg px-3 py-2">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-200 font-semibold">{item.name}</span>
          {item.stat && (
            <span className="text-[10px] font-mono text-amber-400/80">{item.stat}</span>
          )}
        </div>
        {item.description && (
          <div className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">
            {item.description}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="text-gray-400 hover:text-amber-400" aria-label="Bearbeiten">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={onRemove} className="text-gray-500 hover:text-red-400" aria-label="Löschen">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const EquipmentList = ({ items, onChange }) => {
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
    <div className="space-y-4">
      {CATEGORIES.map((cat) => {
        const catEntries = items
          .map((item, idx) => ({ item, idx }))
          .filter(({ item }) => item.category === cat);
        if (!catEntries.length) return null;
        return (
          <div key={cat}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-purple-300 mb-2">
              {cat}
            </div>
            <div className="space-y-2">
              {catEntries.map(({ item, idx }) =>
                editingIdx === idx ? (
                  <EntryForm
                    key={idx}
                    draft={draft}
                    setDraft={setDraft}
                    onCommit={() => commitEdit(idx)}
                    onCancel={() => setEditingIdx(null)}
                  />
                ) : (
                  <Entry
                    key={idx}
                    item={item}
                    onEdit={() => startEdit(idx)}
                    onRemove={() => remove(idx)}
                  />
                ),
              )}
            </div>
          </div>
        );
      })}
      {adding ? (
        <EntryForm draft={draft} setDraft={setDraft} onCommit={commitAdd} onCancel={() => setAdding(false)} />
      ) : (
        <button
          onClick={startAdd}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
        >
          <Plus className="w-3.5 h-3.5" /> Ausrüstung hinzufügen
        </button>
      )}
    </div>
  );
};

export default EquipmentList;
