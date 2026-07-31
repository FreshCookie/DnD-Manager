import React, { useEffect, useState } from "react";
import { Scroll, Trash2, Users } from "lucide-react";
import { deleteAdminChar, fetchAdminOverview } from "./charApi";

const AdminCharRoster = ({ onOpenChar, onBack }) => {
  const [users, setUsers] = useState(null);

  const load = async () => {
    setUsers(await fetchAdminOverview());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (userId, char) => {
    if (!confirm(`"${char.name}" von diesem Spieler wirklich löschen?`)) return;
    await deleteAdminChar(userId, char.id);
    load();
  };

  if (users === null) {
    return <div className="text-center py-16 text-gray-400">Lade alle Charaktere…</div>;
  }

  const hasAny = users.some((u) => u.chars.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">Alle Charaktere</h2>
          <p className="text-sm text-gray-400">GM-Übersicht · {users.length} Spieler</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-teal-900/40 hover:bg-teal-900/60 border border-teal-500/40 text-teal-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Meine Chars
        </button>
      </div>

      {!hasAny ? (
        <div className="text-center py-16 text-amber-200/70">
          <Scroll className="w-12 h-12 mx-auto mb-4 opacity-60" />
          <div className="font-serif text-lg">Noch keine Charaktere angelegt</div>
        </div>
      ) : (
        users
          .filter((u) => u.chars.length > 0)
          .map((user) => (
            <div key={user.userId}>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 border-b border-amber-500/20 pb-2 mb-3">
                <Users className="w-3.5 h-3.5" /> {user.username}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.chars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onOpenChar(user.userId, user.username, c.id)}
                    className="text-left bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-500/20 hover:border-amber-500/40 rounded-lg p-4 flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-gray-100 truncate">
                        {c.name || "Unbenannt"}
                      </div>
                      <div className="text-xs text-gray-400 font-mono truncate">
                        {c.ancestry} · {c.cls} · Lvl {c.level} · HP {c.hp?.cur ?? "?"}/{c.hp?.max ?? "?"}
                      </div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.userId, c);
                      }}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      aria-label="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default AdminCharRoster;
