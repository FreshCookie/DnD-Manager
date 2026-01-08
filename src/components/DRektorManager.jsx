import React, { useState } from "react";
import { Scroll, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { generateId } from "../utils/helpers";

const DRektorManager = ({ theme }) => {
  const { intros, setIntros, selectedStory, sendToPlayerView } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIntro, setEditingIntro] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    image: "",
  });

  const storyIntros = intros.filter((i) => i.storyId === selectedStory?.id);

  const resetForm = () => {
    setFormData({ title: "", text: "", image: "" });
    setIsAdding(false);
    setEditingIntro(null);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.text.trim()) {
      alert("Titel und Text sind Pflichtfelder!");
      return;
    }

    if (editingIntro) {
      setIntros(
        intros.map((i) =>
          i.id === editingIntro.id
            ? {
                ...formData,
                id: editingIntro.id,
                storyId: selectedStory.id,
              }
            : i
        )
      );
    } else {
      const newIntro = {
        ...formData,
        id: generateId(),
        storyId: selectedStory.id,
        createdAt: Date.now(),
      };
      setIntros([...intros, newIntro]);
    }
    resetForm();
  };

  const handleEdit = (intro) => {
    setEditingIntro(intro);
    setFormData({
      title: intro.title,
      text: intro.text,
      image: intro.image || "",
    });
    setIsAdding(true);
  };

  const handleDelete = (introId) => {
    if (window.confirm("Möchtest du dieses Intro wirklich löschen?")) {
      setIntros(intros.filter((i) => i.id !== introId));
    }
  };

  const showToPlayers = (intro) => {
    sendToPlayerView({
      type: "direktor",
      data: intro,
    });
  };

  if (!selectedStory) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-12 shadow-2xl text-center`}
      >
        <p className={`${theme.text} text-xl opacity-70`}>
          Wähle zuerst eine Story aus, um D Rektor Intros zu verwalten.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Scroll className={`${theme.accent} w-6 h-6`} />
          <h3 className={`${theme.text} text-2xl font-bold`}>
            D Rektor Intros
          </h3>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`${theme.button} px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 font-semibold`}
        >
          <Plus className="w-5 h-5" /> Intro hinzufügen
        </button>
      </div>

      {isAdding && (
        <div
          className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-6 mb-6`}
        >
          <h4 className={`${theme.text} text-lg font-bold mb-4`}>
            {editingIntro ? "Intro bearbeiten" : "Neues Intro"}
          </h4>
          <div className="space-y-4">
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="z.B. Mission: Die gestohlenen Artefakte"
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Text von D Rektor
              </label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={6}
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Fahrende Falken, eure nächste Mission wartet..."
              />
            </div>
            <div>
              <label className={`${theme.text} block mb-2 font-semibold`}>
                Bild von D Rektor (optional)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="/images/direktor.jpg"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
              >
                Speichern
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {storyIntros.map((intro) => (
          <div
            key={intro.id}
            className={`${theme.cardBg} ${theme.border} border-2 rounded-lg p-4 hover:shadow-xl transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className={`${theme.text} text-lg font-bold mb-2`}>
                  {intro.title}
                </h4>
                <p className={`${theme.text} text-sm opacity-70 line-clamp-3`}>
                  {intro.text}
                </p>
              </div>
              {intro.image && (
                <img
                  src={intro.image}
                  alt="D Rektor"
                  className="w-20 h-20 object-cover rounded-lg ml-4"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => showToPlayers(intro)}
                className={`${theme.button} flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2`}
              >
                <Eye className="w-4 h-4" /> Zeigen
              </button>
              <button
                onClick={() => handleEdit(intro)}
                className={`${theme.button} px-3 py-2 rounded-lg transition-all hover:scale-105`}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(intro.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {storyIntros.length === 0 && (
        <div className={`${theme.text} text-center py-12 opacity-50`}>
          Noch keine Intros vorhanden. Erstelle dein erstes D Rektor Intro!
        </div>
      )}
    </div>
  );
};

export default DRektorManager;
