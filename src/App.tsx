import { useState, useEffect } from "react";
import GrupoList from "./components/GrupoList";
import GrupoPage from "./components/GrupoPage";
import type { Grupo } from "./types";
import "./App.css";

export default function App() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoAtivo, setGrupoAtivo] = useState<Grupo | null>(null);

  const fetchGrupos = async () => {
    const res = await fetch("http://localhost:3001/api/grupos");
    const data: { id: number; nome: string }[] = await res.json();
    setGrupos(data.map((g) => ({ ...g, pessoas: [], despesas: [], pagamentos: [], saldos: [] })));
  };

  const fetchFullGroup = async (id: number): Promise<Grupo> => {
    const grupoBase = await fetch(`http://localhost:3001/api/grupos/${id}`).then((r) => r.json());
    const [pessoas, despesas, pagamentos, saldos] = await Promise.all([
      fetch(`http://localhost:3001/api/pessoas?grupo_id=${id}`).then((r) => r.json()),
      fetch(`http://localhost:3001/api/despesas?grupo_id=${id}`).then((r) => r.json()),
      fetch(`http://localhost:3001/api/pagamentos?grupo_id=${id}`).then((r) => r.json()),
      fetch(`http://localhost:3001/api/saldos?grupo_id=${id}`).then((r) => r.json()),
    ]);
    return { ...grupoBase, pessoas, despesas, pagamentos, saldos };
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const adicionarGrupo = async (nome: string) => {
    const res = await fetch("http://localhost:3001/api/grupos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    const novo: { id: number; nome: string } = await res.json();
    const full = await fetchFullGroup(novo.id);
    setGrupos((prev) => [...prev, full]);
    setGrupoAtivo(full);
  };

  const selecionarGrupo = async (id: number) => {
    const full = await fetchFullGroup(id);
    setGrupoAtivo(full);
  };

  const atualizarGrupo = async (grupoParcial: Grupo) => {
    const full = await fetchFullGroup(grupoParcial.id);
    setGrupoAtivo(full);
    setGrupos((prev) => prev.map((g) => (g.id === full.id ? full : g)));
  };

  const voltar = () => setGrupoAtivo(null);

  return (
    <div className="container">
      {!grupoAtivo ? (
        <GrupoList
          grupos={grupos}
          adicionarGrupo={adicionarGrupo}
          selecionarGrupo={selecionarGrupo}
        />
      ) : (
        <GrupoPage
          key={grupoAtivo.id}
          grupo={grupoAtivo}
          atualizarGrupo={atualizarGrupo}
          voltar={voltar}
        />
      )}
    </div>
  );
}
