import { useState } from "react";
import GrupoList from "./components/GrupoList";
import GrupoPage from "./components/GrupoPage";
import type { Grupo } from "./types";
import './App.css';

function App() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoAtivo, setGrupoAtivo] = useState<Grupo | null>(null);

  const adicionarGrupo = (nome: string) => {
    const novoGrupo: Grupo = {
      id: Date.now(),
      nome,
      pessoas: [],
      despesas: [],
    };
    setGrupos([...grupos, novoGrupo]);
  };

  const selecionarGrupo = (id: number) => {
    setGrupoAtivo(grupos.find((g) => g.id === id) || null);
  };

  const atualizarGrupo = (grupoAtualizado: Grupo) => {
  setGrupos((prevGrupos) =>
    prevGrupos.map((g) => (g.id === grupoAtualizado.id ? grupoAtualizado : g))
  );
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
