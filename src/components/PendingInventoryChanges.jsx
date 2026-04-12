import React, { useState, useEffect } from "react";
import { Package, Check, X, Clock, Coins } from "lucide-react";

const PendingInventoryChanges = ({ theme }) => {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingChanges();
  }, []);

  const fetchPendingChanges = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/inventory-changes/pending`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der ausstehenden Änderungen");
      }

      const data = await response.json();
      setPendingChanges(data.changes || []);
    } catch (error) {
      console.error("Fehler beim Laden der Änderungen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (changeId, playerName) => {
    if (
      !confirm(
        `Möchtest du die Inventar-Änderung für ${playerName} genehmigen?`,
      )
    ) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/inventory-changes/${changeId}/approve`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Genehmigen der Änderung");
      }

      alert("Änderung genehmigt!");
      fetchPendingChanges(); // Reload
    } catch (error) {
      console.error("Fehler beim Genehmigen:", error);
      alert("Fehler beim Genehmigen der Änderung");
    }
  };

  const handleReject = async (changeId, playerName) => {
    if (
      !confirm(`Möchtest du die Inventar-Änderung für ${playerName} ablehnen?`)
    ) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_BASE_URL}/api/inventory-changes/${changeId}/reject`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Fehler beim Ablehnen der Änderung");
      }

      alert("Änderung abgelehnt!");
      fetchPendingChanges(); // Reload
    } catch (error) {
      console.error("Fehler beim Ablehnen:", error);
      alert("Fehler beim Ablehnen der Änderung");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div
        className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-lg`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className={`w-6 h-6 ${theme.accent}`} />
          <h2 className={`${theme.text} text-2xl font-bold`}>
            Ausstehende Inventar-Änderungen
          </h2>
        </div>
        <div className="text-center py-12 text-gray-400">
          Lade Änderungen...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${theme.accent}`} />
          <h2 className={`${theme.text} text-2xl font-bold`}>
            Ausstehende Inventar-Änderungen
          </h2>
        </div>
        {pendingChanges.length > 0 && (
          <div className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-bold">
            {pendingChanges.length}
          </div>
        )}
      </div>

      {pendingChanges.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-30" />
          <p className="text-gray-400 text-sm">Keine ausstehenden Änderungen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingChanges.map((change) => (
            <div
              key={change.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {change.playerName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Eingereicht: {formatTimestamp(change.timestamp)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Von: {change.submittedBy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(change.id, change.playerName)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Genehmigen
                  </button>
                  <button
                    onClick={() => handleReject(change.id, change.playerName)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Ablehnen
                  </button>
                </div>
              </div>

              {/* Proposed Inventory */}
              <div className="space-y-3">
                {/* Currency */}
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-sm font-bold text-white">Währung</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Platin</div>
                      <div className="text-lg font-bold text-purple-300">
                        {change.proposedInventory.currency.platinum || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Gold</div>
                      <div className="text-lg font-bold text-yellow-400">
                        {change.proposedInventory.currency.gold || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Silber</div>
                      <div className="text-lg font-bold text-gray-300">
                        {change.proposedInventory.currency.silver || 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Kupfer</div>
                      <div className="text-lg font-bold text-orange-400">
                        {change.proposedInventory.currency.copper || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">
                      Gegenstände ({change.proposedInventory.items.length})
                    </h4>
                  </div>
                  {change.proposedInventory.items.length > 0 ? (
                    <div className="space-y-2">
                      {change.proposedInventory.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 bg-gray-800/50 rounded border border-gray-700"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-contain bg-black/20 rounded"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">
                                {item.name}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-xs px-2 py-0.5 bg-purple-900/50 border border-purple-500/30 rounded">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-1">
                                {item.description}
                              </p>
                            )}
                            {item.category && (
                              <span className="text-xs text-gray-500">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-2">
                      Keine Gegenstände
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingInventoryChanges;
