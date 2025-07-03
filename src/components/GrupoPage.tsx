// GrupoPage.tsx
import { useState } from "react";
import type { Grupo, Pessoa } from "../types";
import AdicionarDespesaForm from "./AdicionarDespesaForm";
import PagamentoForm from "./PagamentoForm";
import SaldoResumo from "./SaldoResumo";

type Props = {
  grupo: Grupo;
  atualizarGrupo: (grupo: Grupo) => void;
  voltar: () => void;
};

export default function GrupoPage({ grupo, atualizarGrupo, voltar }: Props) {
  const [nomePessoa, setNomePessoa] = useState<string>("");

  const adicionarPessoa = async () => {
    if (!nomePessoa.trim()) {
      alert("Informe o nome da pessoa!");
      return;
    }

    const resp = await fetch("http://localhost:3001/api/pessoas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomePessoa, grupo_id: grupo.id }),
    });
    if (!resp.ok) {
      alert("Erro ao adicionar pessoa!");
      return;
    }

    const pessoas: Pessoa[] = await fetch(`http://localhost:3001/api/pessoas?grupo_id=${grupo.id}`)
      .then((r) => r.json());

    atualizarGrupo({
      ...grupo,
      pessoas,
    });
    setNomePessoa("");
  };

  return (
    <div className="secao secao-roxa">
      <button onClick={voltar} className="mb-4 underline">← Voltar</button>
      <h2 className="text-xl font-bold">{grupo.nome}</h2>

      <div className="secao secao-roxa">
        <h3 className="Pessoa">Pessoas:</h3>
        <ul>
          {grupo.pessoas.map((p) => (
            <li key={p.id}>{p.nome}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Nome da pessoa"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          className="border p-2 mr-2 mt-2"
        />
        <button onClick={adicionarPessoa} className="bg-green-500 text-white px-4 py-2">
          Adicionar Pessoa
        </button>
      </div>

      <div className="secao secao-roxa">
        <AdicionarDespesaForm grupo={grupo} atualizarGrupo={atualizarGrupo} />
      </div>

      <div className="secao secao-roxa">
        <PagamentoForm grupo={grupo} atualizarGrupo={atualizarGrupo} />
      </div>

      <div className="secao secao-roxa">
        <SaldoResumo grupo={grupo} />
      </div>
    </div>
  );
}
