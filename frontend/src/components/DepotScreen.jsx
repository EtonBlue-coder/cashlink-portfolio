import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Store, Check, QrCode as QrIcon } from "lucide-react";
import { TOKENS } from "../tokens.js";
import { api } from "../api.js";

const PRESETS = ["10", "20", "45", "100"];

export default function DepotScreen({ user, relais, onDepositValidated }) {
  const [montant, setMontant] = useState("45");
  const [selected, setSelected] = useState(0);
  const [pending, setPending] = useState(null); // deposit object once created
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pending) return;
    QRCode.toDataURL(`CASHLINK:${pending.id}:${pending.serial}`, { margin: 1, width: 180 }).then(setQrDataUrl);
  }, [pending]);

  const activeRelais = relais.filter((r) => r.active);

  async function handleGenerate() {
    setError(null);
    setBusy(true);
    try {
      const relaisChoice = activeRelais[selected];
      const deposit = await api.createDeposit(user.id, relaisChoice.id, parseFloat(montant));
      setPending(deposit);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSimulateValidation() {
    setBusy(true);
    setError(null);
    try {
      await api.validateDeposit(pending.id);
      onDepositValidated();
      setPending(null);
      setQrDataUrl(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (pending) {
    return (
      <div className="px-5 pt-6 pb-6 flex flex-col items-center" style={{ background: TOKENS.vanilla, minHeight: 520 }}>
        <p className="cl-display text-[18px] mb-1" style={{ color: TOKENS.ink }}>
          Présente ce QR au point relais
        </p>
        <p className="cl-body text-[12px] mb-5 text-center" style={{ color: TOKENS.slate }}>
          {activeRelais[selected]?.name} · réf. {pending.serial}
        </p>
        {qrDataUrl && (
          <div className="p-3 rounded-[14px] mb-5" style={{ background: TOKENS.paper, border: "1px solid rgba(47,93,80,0.18)" }}>
            <img src={qrDataUrl} alt="QR code de dépôt" width={180} height={180} />
          </div>
        )}
        <p className="cl-mono text-[13px] mb-6" style={{ color: TOKENS.green }}>
          Montant : {parseFloat(montant).toFixed(2)} €
        </p>

        <p className="cl-body text-[11px] mb-3 text-center" style={{ color: TOKENS.slate }}>
          — Démo — le bouton ci-dessous simule la validation par le partenaire
          une fois le cash physiquement remis —
        </p>
        <button
          onClick={handleSimulateValidation}
          disabled={busy}
          className="cl-body w-full flex items-center justify-center gap-2 rounded-[10px] py-3 text-[13px] font-semibold"
          style={{ background: TOKENS.ink, color: TOKENS.gold, opacity: busy ? 0.6 : 1 }}
        >
          <Check size={16} /> {busy ? "Validation…" : "Simuler la validation partenaire"}
        </button>
        {error && (
          <p className="cl-body text-[12px] mt-3" style={{ color: TOKENS.coral }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 pb-6" style={{ background: TOKENS.vanilla, minHeight: 520 }}>
      <p className="cl-display text-[20px] mb-1" style={{ color: TOKENS.ink }}>
        Nouveau dépôt
      </p>
      <p className="cl-body text-[12px] mb-4" style={{ color: TOKENS.slate }}>
        Choisis un montant, puis un point relais proche.
      </p>

      <div className="rounded-[12px] p-4 mb-4" style={{ background: TOKENS.paper, border: "1px solid rgba(47,93,80,0.18)" }}>
        <p className="cl-body text-[11px] tracking-wide mb-1" style={{ color: TOKENS.slate }}>
          Montant à déposer
        </p>
        <div className="flex items-baseline gap-1">
          <span className="cl-mono text-[28px] font-semibold" style={{ color: TOKENS.green }}>
            {montant}
          </span>
          <span className="cl-mono text-[16px]" style={{ color: TOKENS.green }}>
            ,00 €
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => setMontant(v)}
              className="cl-mono text-[12px] px-3 py-1.5 rounded-full"
              style={{
                background: montant === v ? TOKENS.green : "transparent",
                color: montant === v ? TOKENS.vanilla : TOKENS.green,
                border: `1px solid ${TOKENS.green}`,
              }}
            >
              {v}€
            </button>
          ))}
        </div>
      </div>

      <p className="cl-body text-[12px] tracking-wide mb-2" style={{ color: TOKENS.slate }}>
        Points relais disponibles
      </p>
      <div className="space-y-2 mb-4">
        {relais.map((r, i) => {
          const activeIdx = activeRelais.indexOf(r);
          return (
            <button
              key={r.id}
              onClick={() => r.active && setSelected(activeIdx)}
              disabled={!r.active}
              className="w-full text-left rounded-[12px] p-3 flex items-center gap-3"
              style={{
                background: TOKENS.paper,
                border: r.active && selected === activeIdx ? `1.5px solid ${TOKENS.green}` : "1px solid rgba(47,93,80,0.15)",
                opacity: r.active ? 1 : 0.45,
              }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(47,93,80,0.1)" }}>
                <Store size={16} color={TOKENS.green} />
              </div>
              <div className="flex-1">
                <p className="cl-body text-[13px] font-medium" style={{ color: TOKENS.ink }}>
                  {r.name}
                </p>
                <p className="cl-body text-[11px]" style={{ color: TOKENS.slate }}>
                  {r.zone}
                  {!r.active && " · fermé"}
                </p>
              </div>
              {r.active && selected === activeIdx && <Check size={16} color={TOKENS.green} />}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="cl-body text-[12px] mb-2" style={{ color: TOKENS.coral }}>
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={busy || activeRelais.length === 0}
        className="cl-body w-full flex items-center justify-center gap-2 rounded-[10px] py-3 text-[13px] font-semibold"
        style={{ background: TOKENS.ink, color: TOKENS.gold, opacity: busy ? 0.6 : 1 }}
      >
        <QrIcon size={16} /> {busy ? "Génération…" : "Générer le QR de dépôt"}
      </button>
    </div>
  );
}
