import React, { useEffect, useState, useCallback } from "react";
import { TOKENS } from "./tokens.js";
import { api } from "./api.js";
import TabBar from "./components/TabBar.jsx";
import Onboarding from "./components/Onboarding.jsx";
import AccueilScreen from "./components/AccueilScreen.jsx";
import DepotScreen from "./components/DepotScreen.jsx";
import HistoriqueScreen from "./components/HistoriqueScreen.jsx";

const STORAGE_KEY = "cashlink_user_id";

export default function App() {
  const [tab, setTab] = useState("accueil");
  const [user, setUser] = useState(null);
  const [relais, setRelais] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUserAndDeposits = useCallback(async (userId) => {
    const [freshUser, freshDeposits] = await Promise.all([
      api.getUser(userId),
      api.listUserDeposits(userId),
    ]);
    setUser(freshUser);
    setDeposits(freshDeposits);
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const relaisList = await api.listRelais();
        setRelais(relaisList);

        const storedId = localStorage.getItem(STORAGE_KEY);
        if (storedId) {
          await refreshUserAndDeposits(storedId);
        }
      } catch (e) {
        setError("Impossible de contacter l'API CashLink. Vérifie que le backend tourne (voir README).");
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [refreshUserAndDeposits]);

  async function handleCreateUser(name, email) {
    setLoading(true);
    setError(null);
    try {
      const newUser = await api.createUser(name, email);
      localStorage.setItem(STORAGE_KEY, newUser.id);
      setUser(newUser);
      setDeposits([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const relaisMap = Object.fromEntries(relais.map((r) => [r.id, r]));

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-10" style={{ background: "#0F1512" }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded-[38px] overflow-hidden"
          style={{ width: 340, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: "8px solid #0A0F0D" }}
        >
          <div className="cl-mono flex justify-between items-center px-6 pt-3 pb-1 text-[11px]" style={{ background: TOKENS.greenDeep, color: TOKENS.vanilla }}>
            <span>9:41</span>
            <span>CashLink</span>
          </div>

          {loading && (
            <div className="px-5 py-16 text-center" style={{ background: TOKENS.ink, minHeight: 520 }}>
              <p className="cl-body text-[13px]" style={{ color: TOKENS.vanilla }}>Chargement…</p>
            </div>
          )}

          {!loading && error && !user && (
            <div className="px-5 py-16 text-center" style={{ background: TOKENS.ink, minHeight: 520 }}>
              <p className="cl-body text-[13px]" style={{ color: TOKENS.coral }}>{error}</p>
            </div>
          )}

          {!loading && !user && !error && (
            <Onboarding onCreate={handleCreateUser} loading={loading} error={error} />
          )}

          {!loading && user && (
            <>
              {tab === "accueil" && (
                <AccueilScreen user={user} deposits={deposits} relaisMap={relaisMap} goToDepot={() => setTab("depot")} />
              )}
              {tab === "depot" && (
                <DepotScreen
                  user={user}
                  relais={relais}
                  onDepositValidated={() => refreshUserAndDeposits(user.id)}
                />
              )}
              {tab === "historique" && <HistoriqueScreen deposits={deposits} relaisMap={relaisMap} />}
              <TabBar tab={tab} setTab={setTab} />
            </>
          )}
        </div>
        <p className="cl-body text-[11px] tracking-wide" style={{ color: "rgba(241,234,216,0.4)" }}>
          Démo — CashLink Réunion
          {import.meta.env.VITE_DEMO_MODE === "true" && " · données simulées, stockées uniquement sur ton téléphone"}
        </p>
      </div>
    </div>
  );
}
