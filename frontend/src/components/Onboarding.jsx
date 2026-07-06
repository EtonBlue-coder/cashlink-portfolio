import React, { useState } from "react";
import { TOKENS } from "../tokens.js";

export default function Onboarding({ onCreate, loading, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="px-6 pt-10 pb-8" style={{ background: TOKENS.ink, minHeight: 520 }}>
      <p className="cl-display text-[26px] mb-1" style={{ color: TOKENS.vanilla }}>
        Bienvenue sur CashLink
      </p>
      <p className="cl-body text-[12px] mb-6" style={{ color: "rgba(241,234,216,0.55)" }}>
        Crée un compte de démonstration pour tester le parcours de dépôt.
      </p>

      <label className="cl-body text-[11px] tracking-wide block mb-1" style={{ color: "rgba(241,234,216,0.6)" }}>
        Nom
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ton nom"
        className="cl-body w-full rounded-[8px] px-3 py-2 mb-4 text-[13px] outline-none"
        style={{ background: "rgba(241,234,216,0.08)", color: TOKENS.vanilla, border: "1px solid rgba(241,234,216,0.18)" }}
      />

      <label className="cl-body text-[11px] tracking-wide block mb-1" style={{ color: "rgba(241,234,216,0.6)" }}>
        Email
      </label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="toi@exemple.re"
        className="cl-body w-full rounded-[8px] px-3 py-2 mb-4 text-[13px] outline-none"
        style={{ background: "rgba(241,234,216,0.08)", color: TOKENS.vanilla, border: "1px solid rgba(241,234,216,0.18)" }}
      />

      {error && (
        <p className="cl-body text-[12px] mb-3" style={{ color: TOKENS.coral }}>
          {error}
        </p>
      )}

      <button
        onClick={() => name && email && onCreate(name, email)}
        disabled={loading}
        className="cl-body w-full rounded-[10px] py-3 text-[13px] font-semibold"
        style={{ background: TOKENS.gold, color: TOKENS.ink, opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Création…" : "Créer mon compte démo"}
      </button>
    </div>
  );
}
