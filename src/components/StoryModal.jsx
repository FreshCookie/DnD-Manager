import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const StoryModal = ({ theme, story, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "ready",
    completionTime: 0,
    creator: "",
    image: "",
  });

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title || "",
        description: story.description || "",
        status: story.status || "ready",
        completionTime: story.completionTime || 0,
        creator: story.creator || "",
        image: story.image || "",
      });
    }
  }, [story]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Bitte gib einen Titel ein!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${theme.text} text-2xl font-bold`}>
            {story ? "Story bearbeiten" : "Neue Story erstellen"}
          </h3>
          <button
            onClick={onClose}
            className={`${theme.text} opacity-70 hover:opacity-100 transition-all`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="z.B. Das Geheimnis von Nexarion"
              autoFocus
            />
          </div>

          <div>
            <label className={`${theme.text} block mb-2 font-semibold`}>
              GM / Creator
            </label>
            <input
              type="text"
              value={formData.creator}
              onChange={(e) =>
                setFormData({ ...formData, creator: e.target.value })
              }
              className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="z.B. Kevin, Sascha"
            />
          </div>

          <div>
            <label className={`${theme.text} block mb-2 font-semibold`}>
              Beschreibung
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="Kurze Beschreibung der Story..."
            />
          </div>

          <div>
            <label className={`${theme.text} block mb-2 font-semibold`}>
              Story Bild (optional)
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className={`w-full px-4 py-3 ${theme.cardBg} ${theme.border} border rounded-lg ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="/images/stories/nexarion.jpg"
            />
            <p className={`${theme.text} text-xs opacity-50 mt-1`}>
              Visuelle Referenz für die Stadt/Story
            </p>
            {formData.image && (
              <img
                src={formData.image}
                alt="Story Preview"
                className="w-full h-32 object-cover rounded-lg mt-2"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className={`${theme.text} block mb-2 font-semibold`}>
              Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "wip" })}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.status === "wip"
                    ? "bg-yellow-500/30 border-2 border-yellow-500 text-yellow-300"
                    : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                }`}
              >
                Work in Progress
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "ready" })}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.status === "ready"
                    ? "bg-blue-500/30 border-2 border-blue-500 text-blue-300"
                    : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                }`}
              >
                Noch nicht gespielt
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, status: "completed" })
                }
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  formData.status === "completed"
                    ? "bg-green-500/30 border-2 border-green-500 text-green-300"
                    : `${theme.cardBg} ${theme.border} border ${theme.text} opacity-70`
                }`}
              >
                Abgeschlossen
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className={`${theme.button} flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105`}
            >
              Speichern
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryModal;
