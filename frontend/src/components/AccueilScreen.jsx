import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TOKENS } from "../tokens.js";
import BillCard from "./BillCard.jsx";

export default function AccueilScreen({ user, deposits, relaisMap, goToDepot }) {
  const recent = deposits.slice(0, 2);

  return (
    <div className="px-5 pt-4 pb-6" style={{ background: TOKENS.ink, minHeight: 520 }}>
      <p className="cl-body text-[12px] tracking-wide mb-1" style={{ color: "rgba(241,234,216,0.5)" }}>
        Solde disponible
      </p>
      <p className="cl-display text-[40px] leading-none mb-5" style={{ color: TOKENS.vanilla }}>
        {(user.balance_cents ?? 0).toFixed(2).split(".")[0]}
        <span style={{ color: TOKENS.gold }}>,{(user.balance_cents ?? 0).toFixed(2).split(".")[1]} €</span>
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={goToDepot}
          className="cl-body flex items-center justify-center gap-2 rounded-[10px] py-3 text-[13px] font-medium"
          style={{ background: TOKENS.gold, color: TOKENS.ink }}
        >
          <ArrowDownLeft size={16} /> Déposer
        </button>
        <button
          disabled
          title="Non disponible en démo — nécessite un partenaire de paiement agréé"
          className="cl-body flex items-center justify-center gap-2 rounded-[10px] py-3 text-[13px] font-medium"
          style={{ background: "rgba(241,234,216,0.08)", color: "rgba(241,234,216,0.4)", border: "1px solid rgba(241,234,216,0.18)" }}
        >
          <ArrowUpRight size={16} /> Virement
        </button>
      </div>

      <p className="cl-body text-[12px] tracking-wide mb-2" style={{ color: "rgba(241,234,216,0.5)" }}>
        Derniers mouvements
      </p>

      {recent.length === 0 && (
        <p className="cl-body text-[12px]" style={{ color: "rgba(241,234,216,0.4)" }}>
          Aucun dépôt pour l'instant.
        </p>
      )}

      <div className="space-y-2">
        {recent.map((d) => (
          <BillCard key={d.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="cl-body text-[13px] font-medium" style={{ color: TOKENS.ink }}>
                  Dépôt — {relaisMap[d.relais_id]?.name || "Point relais"}
                </p>
                <p className="cl-mono text-[10px] mt-0.5" style={{ color: TOKENS.slate }}>
                  {new Date(d.created_at).toLocaleString("fr-FR")} · N° {d.serial}
                </p>
              </div>
              <p className="cl-mono text-[14px] font-semibold" style={{ color: TOKENS.green }}>
                +{d.amount_cents.toFixed(2)} €
              </p>
            </div>
          </BillCard>
        ))}
      </div>
    </div>
  );
}
