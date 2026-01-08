export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "wip":
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
    case "ready":
      return "bg-blue-500/20 border-blue-500/50 text-blue-300";
    case "completed":
      return "bg-green-500/20 border-green-500/50 text-green-300";
    default:
      return "bg-gray-500/20 border-gray-500/50 text-gray-300";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "wip":
      return "Work in Progress";
    case "ready":
      return "Noch nicht gespielt";
    case "completed":
      return "Abgeschlossen";
    default:
      return "Unbekannt";
  }
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
