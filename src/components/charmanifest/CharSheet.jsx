import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Minus,
  Plus,
  Save,
  X,
} from "lucide-react";
import EditableList from "./EditableList";
import {
  compressImage,
  saveAdminChar,
  saveChar as saveCharApi,
} from "./charApi";

const Card = ({ title, children, className = "" }) => (
  <div
    className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-5 border border-purple-500/20 ${className}`}
  >
    <h3 className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

const NumberField = ({ label, value, onCommit }) => {
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);
  return (
    <div className="bg-gray-900/50 border border-purple-500/10 rounded-lg text-center py-2">
      <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </div>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => onCommit(parseInt(val, 10) || 0)}
        className="w-full bg-transparent text-center text-lg font-bold text-gray-100 outline-none"
      />
    </div>
  );
};

const CharSheet = ({ char: initialChar, adminCtx, onBack }) => {
  const [char, setChar] = useState(initialChar);
  const [saved, setSaved] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [editingSkillIdx, setEditingSkillIdx] = useState(null);
  const [skillEdit, setSkillEdit] = useState({ name: "", stat: "" });
  const photoInputRef = useRef(null);
  const savedTimer = useRef(null);

  const flashSaved = () => {
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 900);
  };

  const persist = async (next) => {
    const ok = adminCtx
      ? await saveAdminChar(adminCtx.userId, next)
      : await saveCharApi(next);
    if (ok) flashSaved();
  };

  // Strukturelle Änderungen (Buttons, Listen, Fotos) speichern sofort mit dem
  // exakten neuen Objekt - Text-/Zahlenfelder erst beim Verlassen des Feldes.
  const apply = (updater) => {
    setChar((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        persist(char);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char]);

  const setField = (key, value) =>
    setChar((prev) => ({ ...prev, [key]: value }));
  const commitField = (key, value) => {
    setChar((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  };

  const photos = char.photos || [];

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      apply((prev) => ({ ...prev, photos: [...(prev.photos || []), ...compressed] }));
    } catch {
      alert("Bild konnte nicht geladen werden.");
    }
  };

  const removePhoto = (idx) =>
    apply((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));

  const woundsMax = char.wounds?.max || 0;
  const woundsCur = char.wounds?.cur || 0;
  const setWounds = (n) =>
    apply((prev) => ({ ...prev, wounds: { ...prev.wounds, cur: n } }));

  const hp = char.hp || { cur: 0, max: 0 };
  const bumpHp = (delta) =>
    apply((prev) => ({
      ...prev,
      hp: { ...prev.hp, cur: Math.max(0, prev.hp.cur + delta) },
    }));

  const currency = char.currency || { platinum: 0, gold: 0, silver: 0, bronze: 0 };

  const startSkillEdit = (idx) => {
    setEditingSkillIdx(idx);
    setSkillEdit({ name: char.skills[idx].name, stat: char.skills[idx].stat });
  };
  const commitSkillEdit = (idx) => {
    const name = skillEdit.name.trim();
    const stat = skillEdit.stat.trim().toUpperCase();
    apply((prev) => {
      const skills = [...prev.skills];
      skills[idx] = { ...skills[idx], name: name || skills[idx].name, stat: stat || skills[idx].stat };
      return { ...prev, skills };
    });
    setEditingSkillIdx(null);
  };
  const bumpSkill = (idx, delta) =>
    apply((prev) => {
      const skills = [...prev.skills];
      skills[idx] = { ...skills[idx], val: skills[idx].val + delta };
      return { ...prev, skills };
    });
  const addSkill = () =>
    apply((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "Neuer Skill", stat: "STR", val: 0 }],
    }));
  const removeSkill = (idx) =>
    apply((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {adminCtx ? "Zurück zur Übersicht" : "Zurück zum Manifest"}
        </button>
        <div className="flex items-center gap-3">
          {adminCtx && (
            <span className="text-xs font-mono text-amber-400/80">
              [{adminCtx.username}]
            </span>
          )}
          <span
            className={`text-xs font-semibold text-emerald-400 transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}
          >
            ✓ gespeichert
          </span>
          <button
            onClick={() => persist(char)}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> Speichern
          </button>
        </div>
      </div>

      {/* Kopfzeile */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-5 border border-amber-500/30">
        <input
          value={char.name}
          onChange={(e) => setField("name", e.target.value)}
          onBlur={() => persist(char)}
          placeholder="Charaktername"
          className="w-full bg-transparent text-2xl font-bold text-gray-100 outline-none font-serif"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <input
            value={char.ancestry}
            onChange={(e) => setField("ancestry", e.target.value)}
            onBlur={() => persist(char)}
            placeholder="Ancestry"
            className="w-28 bg-gray-900/50 border border-purple-500/20 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none focus:border-amber-500/50"
          />
          <input
            value={char.cls}
            onChange={(e) => setField("cls", e.target.value)}
            onBlur={() => persist(char)}
            placeholder="Klasse"
            className="w-28 bg-gray-900/50 border border-purple-500/20 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none focus:border-amber-500/50"
          />
          <span className="flex items-center gap-1 bg-purple-900/30 border border-purple-500/30 rounded-full px-3 py-1 text-xs text-purple-300">
            Lvl
            <input
              type="number"
              value={char.level}
              onChange={(e) => setField("level", e.target.value)}
              onBlur={() => commitField("level", parseInt(char.level, 10) || 1)}
              className="w-8 bg-transparent outline-none text-center"
            />
          </span>
          <input
            value={char.hitDice}
            onChange={(e) => setField("hitDice", e.target.value)}
            onBlur={() => persist(char)}
            placeholder="Hit Dice"
            className="w-20 bg-gray-900/50 border border-purple-500/20 rounded-lg px-2 py-1 text-sm text-gray-300 outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-2 text-right">
          #{char.id.slice(-6).toUpperCase()}
        </div>
      </div>

      {/* Fotos */}
      <Card title="Fotos">
        <div className="flex flex-wrap gap-3">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative w-20 h-20 group">
              <img
                src={photo}
                alt={`Foto ${idx + 1}`}
                onClick={() => setLightboxIdx(idx)}
                className="w-full h-full object-cover rounded-lg border border-purple-500/20 cursor-pointer"
              />
              <button
                onClick={() => removePhoto(idx)}
                aria-label="Foto entfernen"
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => photoInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 flex items-center justify-center text-amber-400 text-2xl transition-colors"
            aria-label="Foto hinzufügen"
          >
            <Plus className="w-6 h-6" />
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </div>
      </Card>

      {lightboxIdx !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            aria-label="Schließen"
          >
            <X className="w-8 h-8" />
          </button>
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length);
              }}
              className="absolute left-4 text-white/70 hover:text-white"
              aria-label="Vorheriges Foto"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}
          <img
            src={photos[lightboxIdx]}
            alt="Foto"
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx + 1) % photos.length);
              }}
              className="absolute right-4 text-white/70 hover:text-white"
              aria-label="Nächstes Foto"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attribute */}
        <Card title="Attribute">
          <div className="grid grid-cols-4 gap-2">
            <NumberField label="STR" value={char.str} onCommit={(v) => commitField("str", v)} />
            <NumberField label="DEX" value={char.dex} onCommit={(v) => commitField("dex", v)} />
            <NumberField label="INT" value={char.int} onCommit={(v) => commitField("int", v)} />
            <NumberField label="WIL" value={char.wil} onCommit={(v) => commitField("wil", v)} />
          </div>
        </Card>

        {/* Vitalwerte */}
        <Card title="Vitalwerte">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 bg-gray-900/50 border border-purple-500/10 rounded-lg py-2 px-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                Hit Points
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => bumpHp(-1)}
                  className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-200"
                  aria-label="HP verringern"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  className={`font-bold text-lg w-8 text-center ${hp.cur > hp.max ? "text-amber-400" : "text-teal-300"}`}
                >
                  {hp.cur}
                </span>
                <button
                  onClick={() => bumpHp(1)}
                  className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-200"
                  aria-label="HP erhöhen"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="text-gray-500">/</span>
                <input
                  type="number"
                  value={hp.max}
                  onChange={(e) =>
                    setChar((prev) => ({ ...prev, hp: { ...prev.hp, max: e.target.value } }))
                  }
                  onBlur={() => {
                    const max = parseInt(hp.max, 10) || 0;
                    apply((prev) => ({
                      ...prev,
                      hp: { cur: Math.min(prev.hp.cur, max), max },
                    }));
                  }}
                  className="w-10 bg-gray-800 border border-purple-500/20 rounded text-center outline-none"
                />
              </div>
            </div>
            <NumberField label="Temp HP" value={char.tempHp || 0} onCommit={(v) => commitField("tempHp", v)} />
            <NumberField label="Rüstung" value={char.armor} onCommit={(v) => commitField("armor", v)} />
            <NumberField label="Initiative" value={char.initiative} onCommit={(v) => commitField("initiative", v)} />
          </div>
        </Card>
      </div>

      {/* Wunden */}
      <Card title="Wunden">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: woundsMax }, (_, i) => (
            <button
              key={i}
              onClick={() => setWounds(i + 1 === woundsCur ? i : i + 1)}
              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                i < woundsCur
                  ? "bg-red-600 border-red-500"
                  : "bg-transparent border-gray-600 hover:border-red-500/50"
              }`}
              aria-label={`Wunde ${i + 1}`}
            />
          ))}
        </div>
      </Card>

      {/* Währung */}
      <Card title="Währung">
        <div className="grid grid-cols-4 gap-2">
          {[
            ["platinum", "Platin"],
            ["gold", "Gold"],
            ["silver", "Silber"],
            ["bronze", "Bronze"],
          ].map(([key, label]) => (
            <NumberField
              key={key}
              label={label}
              value={currency[key] || 0}
              onCommit={(v) =>
                setChar((prev) => {
                  const next = { ...prev, currency: { ...prev.currency, [key]: Math.max(0, v) } };
                  persist(next);
                  return next;
                })
              }
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2">
          <Coins className="w-3 h-3" /> Automatisch gespeichert
        </div>
      </Card>

      {/* Skills */}
      <Card title="Skills">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {char.skills.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-900/50 border border-purple-500/10 rounded-lg px-3 py-2 gap-2"
            >
              {editingSkillIdx === idx ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    autoFocus
                    value={skillEdit.name}
                    onChange={(e) => setSkillEdit((s) => ({ ...s, name: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && commitSkillEdit(idx)}
                    className="flex-1 min-w-0 bg-gray-800 border border-amber-500/40 rounded px-2 py-1 text-xs text-gray-100 outline-none"
                  />
                  <input
                    value={skillEdit.stat}
                    onChange={(e) => setSkillEdit((s) => ({ ...s, stat: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && commitSkillEdit(idx)}
                    className="w-12 bg-gray-800 border border-amber-500/40 rounded px-1 py-1 text-xs text-center font-mono uppercase text-gray-300 outline-none"
                  />
                  <button onClick={() => commitSkillEdit(idx)} className="text-emerald-400 shrink-0">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startSkillEdit(idx)}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  <span className="text-sm text-gray-200 truncate">{s.name}</span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-900/30 rounded px-1.5 py-0.5 shrink-0">
                    {s.stat}
                  </span>
                </button>
              )}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => bumpSkill(idx, -1)}
                  className="w-5 h-5 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                  aria-label="Wert verringern"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-gray-100">{s.val}</span>
                <button
                  onClick={() => bumpSkill(idx, 1)}
                  className="w-5 h-5 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                  aria-label="Wert erhöhen"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeSkill(idx)}
                  className="text-gray-500 hover:text-red-400"
                  aria-label="Skill entfernen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addSkill}
          className="mt-3 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
        >
          <Plus className="w-3.5 h-3.5" /> Skill hinzufügen
        </button>
      </Card>

      {/* Inventar */}
      <Card title="Inventar & Ausrüstung">
        <EditableList
          items={char.inventory}
          placeholder="Neuer Gegenstand…"
          onChange={(inventory) => apply((prev) => ({ ...prev, inventory }))}
        />
      </Card>

      {/* Fähigkeiten */}
      <Card title="Fähigkeiten & Talente">
        <EditableList
          items={char.abilities}
          placeholder="Neue Fähigkeit…"
          onChange={(abilities) => apply((prev) => ({ ...prev, abilities }))}
        />
      </Card>

      {/* Notizen */}
      <Card title="Background & Notizen">
        <textarea
          value={char.notes || ""}
          onChange={(e) => setField("notes", e.target.value)}
          onBlur={() => persist(char)}
          placeholder="Hintergrundgeschichte, Ziele, wichtige NPCs…"
          rows={5}
          className="w-full bg-gray-900/50 border border-purple-500/10 rounded-lg p-3 text-sm text-gray-200 outline-none focus:border-amber-500/40 resize-y"
        />
      </Card>
    </div>
  );
};

export default CharSheet;
