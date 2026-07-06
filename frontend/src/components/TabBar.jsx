import React from "react";
import { TOKENS } from "../tokens.js";

const items = [
  { id: "accueil", label: "Solde" },
  { id: "depot", label: "Déposer" },
  { id: "historique", label: "Historique" },
];

export default function TabBar({ tab, setTab }) {
  return (
    <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: TOKENS.greenDeep }}>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => setTab(it.id)}
          className="cl-body flex-1 py-3 text-[12px] tracking-wide"
          style={{
            color: tab === it.id ? TOKENS.gold : "rgba(241,234,216,0.55)",
            fontWeight: tab === it.id ? 600 : 500,
            borderTop: tab === it.id ? `2px solid ${TOKENS.gold}` : "2px solid transparent",
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
