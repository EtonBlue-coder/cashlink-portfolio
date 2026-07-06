import React from "react";
import { ArrowDownLeft, Clock } from "lucide-react";
import { TOKENS } from "../tokens.js";
import BillCard from "./BillCard.jsx";

export default function HistoriqueScreen({ deposits, relaisMap }) {
  return (
    <div className="px-5 pt-4 pb-6" style={{ background: TOKENS.vanilla, minHeight: 520 }}>
      <p className="cl-display text-[20px] mb-4" style={{ color: TOKENS.ink }}>
        Historique
      </p>

      {deposits.length === 0 && (
        <p className="cl-body text-[12px]" style={{ color: TOKENS.slate }}>
          Aucune transaction pour l'instant.
        </p>
      )}

      <div className="space-y-2">
        {deposits.map((d) => (
          <BillCard key={d.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(47,93,80,0.12)" }}
                >
                  <ArrowDownLeft size={14} color={TOKENS.green} />
                </div>
                <div>
                  <p className="cl-body text-[13px] font-medium" style={{ color: TOKENS.ink }}>
                    Dépôt — {relaisMap[d.relais_id]?.name || "Point relais"}
                  </p>
                  <p className="cl-mono text-[10px] mt-0.5 flex items-center gap-1" style={{ color: TOKENS.slate }}>
                    <Clock size={10} /> {new Date(d.created_at).toLocaleString("fr-FR")} · {d.status}
                  </p>
                </div>
              </div>
              <p className="cl-mono text-[13px] font-semibold" style={{ color: TOKENS.green }}>
                +{d.amount_cents.toFixed(2)} €
              </p>
            </div>
          </BillCard>
        ))}
      </div>
    </div>
  );
}
