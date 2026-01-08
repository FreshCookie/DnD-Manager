export const themes = {
  // === Bestehende Themes ===
  dark: {
    name: "Dark Fantasy",
    bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900",
    cardBg: "bg-gray-800/50 backdrop-blur-sm",
    border: "border-purple-500/30",
    text: "text-gray-100",
    accent: "text-purple-400",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  fire: {
    name: "Dragon Fire",
    bg: "bg-gradient-to-br from-red-950 via-orange-900 to-black",
    cardBg: "bg-red-900/30 backdrop-blur-sm",
    border: "border-orange-500/40",
    text: "text-gray-100",
    accent: "text-orange-400",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  forest: {
    name: "Mystic Forest",
    bg: "bg-gradient-to-br from-green-950 via-emerald-900 to-gray-900",
    cardBg: "bg-green-900/30 backdrop-blur-sm",
    border: "border-emerald-500/40",
    text: "text-gray-100",
    accent: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  ice: {
    name: "Frozen Realm",
    bg: "bg-gradient-to-br from-cyan-950 via-blue-900 to-gray-900",
    cardBg: "bg-blue-900/30 backdrop-blur-sm",
    border: "border-cyan-500/40",
    text: "text-gray-100",
    accent: "text-cyan-400",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },

  // === NEUE PREMIUM THEMES ===

  // 1. Goldene Kathedrale - Luxuriös & Edel
  cathedral: {
    name: "Golden Cathedral",
    bg: "bg-gradient-to-br from-amber-950 via-yellow-900 to-stone-950",
    cardBg:
      "bg-gradient-to-br from-amber-900/40 to-yellow-950/40 backdrop-blur-sm",
    border: "border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    text: "text-amber-50",
    accent: "text-amber-300",
    button:
      "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/50",
  },

  // 2. Abyssal Depth - Dunkel & Mysteriös mit Teal
  abyss: {
    name: "Abyssal Depths",
    bg: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-black",
    cardBg:
      "bg-gradient-to-br from-slate-900/60 via-purple-950/40 to-indigo-950/50 backdrop-blur-md",
    border: "border-teal-400/50 shadow-[0_0_20px_rgba(45,212,191,0.2)]",
    text: "text-slate-100",
    accent: "text-teal-300",
    button:
      "bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600 shadow-xl shadow-teal-900/40",
  },

  // 3. Blood Moon - Dunkelrot & Gothic
  bloodmoon: {
    name: "Blood Moon",
    bg: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950 via-red-950 to-black",
    cardBg:
      "bg-gradient-to-br from-red-950/50 via-rose-900/40 to-black/60 backdrop-blur-sm",
    border: "border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.3)]",
    text: "text-rose-50",
    accent: "text-rose-300",
    button:
      "bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 shadow-xl shadow-rose-950/60",
  },

  // 4. Arcane Nexus - Magisch mit Lila/Pink Gradient
  arcane: {
    name: "Arcane Nexus",
    bg: "bg-gradient-to-br from-purple-950 via-fuchsia-950 to-indigo-950",
    cardBg:
      "bg-gradient-to-br from-purple-900/40 via-fuchsia-900/30 to-indigo-900/40 backdrop-blur-md",
    border: "border-fuchsia-400/60 shadow-[0_0_20px_rgba(232,121,249,0.4)]",
    text: "text-purple-50",
    accent: "text-fuchsia-300",
    button:
      "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 shadow-2xl shadow-fuchsia-900/50",
  },

  // 5. Desert Oasis - Warm & Sand-farben
  desert: {
    name: "Desert Oasis",
    bg: "bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-950",
    cardBg:
      "bg-gradient-to-br from-orange-900/40 via-amber-800/30 to-yellow-900/40 backdrop-blur-sm",
    border: "border-orange-400/50 shadow-[0_0_15px_rgba(251,146,60,0.3)]",
    text: "text-orange-50",
    accent: "text-amber-300",
    button:
      "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-900/50",
  },

  // 6. Volcanic Forge - Lava & Glühend
  volcanic: {
    name: "Volcanic Forge",
    bg: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-600 via-red-950 to-black",
    cardBg:
      "bg-gradient-to-t from-red-950/60 via-orange-950/40 to-black/50 backdrop-blur-sm",
    border: "border-orange-500/70 shadow-[0_0_30px_rgba(249,115,22,0.4)]",
    text: "text-orange-50",
    accent: "text-orange-300",
    button:
      "bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 hover:from-red-600 hover:via-orange-500 hover:to-amber-500 shadow-2xl shadow-orange-900/60",
  },

  // 7. Celestial - Sternen-Theme mit Blau/Lila
  celestial: {
    name: "Celestial Skies",
    bg: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-blue-950 to-slate-950",
    cardBg:
      "bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-slate-900/50 backdrop-blur-md",
    border: "border-blue-400/60 shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    text: "text-blue-50",
    accent: "text-blue-300",
    button:
      "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-xl shadow-indigo-900/50",
  },

  // 8. Nether Realm - Dunkel-Lila mit Grün-Akzenten
  nether: {
    name: "Nether Realm",
    bg: "bg-gradient-to-br from-violet-950 via-purple-950 to-black",
    cardBg:
      "bg-gradient-to-br from-violet-900/40 via-purple-950/40 to-black/60 backdrop-blur-sm",
    border: "border-lime-400/50 shadow-[0_0_20px_rgba(163,230,53,0.2)]",
    text: "text-violet-50",
    accent: "text-lime-300",
    button:
      "bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 shadow-xl shadow-violet-950/60",
  },
};
