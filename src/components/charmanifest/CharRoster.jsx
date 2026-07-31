import React, { useEffect, useState } from "react";
import { Plus, Scroll, ShieldAlert, Trash2 } from "lucide-react";
import {
  createBlankChar,
  deleteChar,
  fetchChar,
  fetchCharList,
  saveChar,
  saveCharList,
} from "./charApi";

const CharRoster = ({ isGm, onOpenChar, onOpenAdmin }) => {
  const [chars, setChars] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const load = async () => {
    const ids = await fetchCharList();
    const loaded = [];
    for (const id of ids) {
      const c = await fetchChar(id);
      if (c) loaded.push(c);
    }
    setChars(loaded);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    const char = createBlankChar(name);
    await saveChar(char);
    const ids = await fetchCharList();
    await saveCharList([...ids, char.id]);
    setNewName("");
    setCreating(false);
    onOpenChar(char.id);
  };

  const handleDelete = async (char) => {
    if (!confirm(`"${char.name}" wirklich löschen?`)) return;
    await deleteChar(char.id);
    const ids = await fetchCharList();
    await saveCharList(ids.filter((id) => id !== char.id));
    load();
  };

  if (chars === null) {
    return <div className="text-center py-16 text-gray-400">Lade Manifest…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">Reisemanifest</h2>
          <p className="text-sm text-gray-400">Charakterverwaltung</p>
        </div>
        {isGm && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" /> GM: Alle Chars
          </button>
        )}
      </div>

      {chars.length === 0 ? (
        <div className="text-center py-16 text-amber-200/70">
          <Scroll className="w-12 h-12 mx-auto mb-4 opacity-60" />
          <div className="font-serif text-lg mb-1">Noch keine Charaktere</div>
          <div className="text-sm opacity-70">Lege deinen ersten Charakter an!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chars.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenChar(c.id)}
              className="text-left bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-500/20 hover:border-amber-500/40 rounded-lg p-4 flex items-center gap-3 transition-colors group"
            >
              {(c.photos && c.photos[0]) && (
                <img
                  src={c.photos[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border border-amber-500/30 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-serif font-bold text-gray-100 truncate">
                  {c.name || "Unbenannt"}
                </div>
                <div className="text-xs text-gray-400 font-mono truncate">
                  {c.ancestry} {c.ancestry && c.cls && "·"} {c.cls} · Lvl {c.level} · HP {c.hp?.cur}/{c.hp?.max}
                </div>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c);
                }}
                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                aria-label="Löschen"
              >
                <Trash2 className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      )}

      {creating ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="Name des neuen Charakters…"
            className="flex-1 bg-gray-900/50 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none"
          />
          <button
            onClick={handleCreate}
            className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Anlegen
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="w-full border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 text-amber-400 rounded-lg py-3 text-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuen Charakter anlegen
        </button>
      )}
    </div>
  );
};

export default CharRoster;
