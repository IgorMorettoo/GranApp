import { useState, useEffect } from "react";
import GrupoList from "./components/GrupoList";
import GrupoPage from "./components/GrupoPage";
import type { Grupo, Pessoa, Despesa, Pagamento } from "./types";
import './App.css';

function App() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoAtivo, setGrupoAtivo] = useState<Grupo | null>(null);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/grupos");
      const data: Grupo[] = await res.json();
      setGrupos(data);
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    }
  };

  const adicionarGrupo = async (nome: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/grupos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      const novoGrupo: { id: number; nome: string } = await res.json();
      setGrupos((prev) => [...prev, { ...novoGrupo, pessoas: [], despesas: [], pagamentos: [] }]);
    } catch (error) {
      console.error("Erro ao adicionar grupo:", error);
    }
  };

  const selecionarGrupo = async (id: number) => {
    try {
      const [resG, resP, resD, resPag] = await Promise.all([
        fetch(`http://localhost:3001/api/grupos/${id}`),
        fetch(`http://localhost:3001/api/pessoas?grupo_id=${id}`),
        fetch(`http://localhost:3001/api/despesas?grupo_id=${id}`),
        fetch(`http://localhost:3001/api/pagamentos?grupo_id=${id}`)
      ]);
      const grupoInfo: { id: number; nome: string } = await resG.json();
      const pessoas: Pessoa[] = await resP.json();
      const despesas: Despesa[] = await resD.json();
      const pagamentos: Pagamento[] = await resPag.json();
      setGrupoAtivo({ ...grupoInfo, pessoas, despesas, pagamentos });
    } catch (error) {
      console.error("Erro ao selecionar grupo:", error);
    }
  };

  const atualizarGrupo = (grupoAtualizado: Grupo) => {
    setGrupos((prev) => prev.map(g => g.id === grupoAtualizado.id ? grupoAtualizado : g));
    setGrupoAtivo(grupoAtualizado);
  };

  return (
    <div className="container">
      {!grupoAtivo ? (
        <GrupoList grupos={grupos} adicionarGrupo={adicionarGrupo} selecionarGrupo={selecionarGrupo} />
      ) : (
        <GrupoPage grupo={grupoAtivo} atualizarGrupo={atualizarGrupo} voltar={() => setGrupoAtivo(null)} />
      )}
    </div>
  );
}

export default App;