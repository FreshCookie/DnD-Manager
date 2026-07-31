import React, { useEffect, useState } from "react";
import CharRoster from "./CharRoster";
import AdminCharRoster from "./AdminCharRoster";
import CharSheet from "./CharSheet";
import { fetchAdminChar, fetchChar } from "./charApi";

// view: "roster" | "sheet" | "adminRoster" | "adminSheet"
const CharManifest = ({ currentUser }) => {
  const [view, setView] = useState("roster");
  const [char, setChar] = useState(null);
  const [adminCtx, setAdminCtx] = useState(null);
  const isGm = currentUser?.role === "gm";

  const openChar = async (id) => {
    const c = await fetchChar(id);
    if (!c) return;
    setChar(c);
    setAdminCtx(null);
    setView("sheet");
  };

  const openAdminChar = async (userId, username, id) => {
    const c = await fetchAdminChar(userId, id);
    if (!c) return;
    setChar(c);
    setAdminCtx({ userId, username });
    setView("adminSheet");
  };

  useEffect(() => {
    if (!isGm && (view === "adminRoster" || view === "adminSheet")) {
      setView("roster");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGm]);

  return (
    <div className="py-2">
      {view === "roster" && (
        <CharRoster
          isGm={isGm}
          onOpenChar={openChar}
          onOpenAdmin={() => setView("adminRoster")}
        />
      )}
      {view === "adminRoster" && (
        <AdminCharRoster onOpenChar={openAdminChar} onBack={() => setView("roster")} />
      )}
      {(view === "sheet" || view === "adminSheet") && char && (
        <CharSheet
          char={char}
          adminCtx={adminCtx}
          onBack={() => setView(adminCtx ? "adminRoster" : "roster")}
        />
      )}
    </div>
  );
};

export default CharManifest;
