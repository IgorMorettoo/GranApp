import { useState } from "react";
import type { Grupo } from "../types";

type Props = {
  grupos: Grupo[];
  adicionarGrupo: (nome: string) => void;
  selecionarGrupo: (id: number) => void;
};

export default function GrupoList({ grupos, adicionarGrupo, selecionarGrupo }: Props) {
  const [nome, setNome] = useState<string>("");

  const handleAddGrupo = () => {
    if (!nome.trim()) {
      alert("O nome do grupo não pode ser vazio!");
      return;
    }
    adicionarGrupo(nome);
    setNome("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Grupos</h1>
      <input
        type="text"
        placeholder="Nome do grupo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleAddGrupo} className="bg-blue-500 text-white px-4 py-2">
        Adicionar Grupo
      </button>

      <ul className="mt-4">
        {grupos.map((g) => (
          <li
            key={g.id}
            onClick={() => selecionarGrupo(g.id)}
            className="grupo-item cursor-pointer hover:underline"
          >
            {g.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
