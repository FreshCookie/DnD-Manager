import React, { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

const EditableList = ({ items, onChange, placeholder }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newValue, setNewValue] = useState("");

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditValue(items[idx]);
  };

  const commitEdit = (idx) => {
    const v = editValue.trim();
    if (v) {
      const next = [...items];
      next[idx] = v;
      onChange(next);
    }
    setEditingIdx(null);
  };

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  const add = () => {
    const v = newValue.trim();
    if (!v) return;
    onChange([...items, v]);
    setNewValue("");
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 bg-gray-900/50 border border-purple-500/10 rounded-lg px-3 py-2"
        >
          {editingIdx === idx ? (
            <>
              <input
                autoFocus
                className="flex-1 bg-gray-800 border border-amber-500/40 rounded px-2 py-1 text-sm text-gray-100 outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(idx);
                  if (e.key === "Escape") setEditingIdx(null);
                }}
              />
              <button
                onClick={() => commitEdit(idx)}
                className="text-emerald-400 hover:text-emerald-300 shrink-0"
                aria-label="Übernehmen"
              >
                <Check className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-gray-200 break-words">
                {item}
              </span>
              <button
                onClick={() => startEdit(idx)}
                className="text-gray-400 hover:text-amber-400 shrink-0"
                aria-label="Bearbeiten"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => remove(idx)}
                className="text-gray-500 hover:text-red-400 shrink-0"
                aria-label="Löschen"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-900/50 border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-amber-500/50"
          placeholder={placeholder}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button
          onClick={add}
          className="px-3 py-2 bg-amber-700/80 hover:bg-amber-600 rounded-lg text-sm font-semibold text-white flex items-center gap-1 shrink-0"
        >
          <Plus className="w-4 h-4" /> Hinzufügen
        </button>
      </div>
    </div>
  );
};

export default EditableList;
