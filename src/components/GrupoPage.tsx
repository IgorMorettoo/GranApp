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

  const adicionarPessoa = () => {
    const novaPessoa: Pessoa = { id: Date.now(), nome: nomePessoa };
    atualizarGrupo({ ...grupo, pessoas: [...grupo.pessoas, novaPessoa] });
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
      <button onClick={adicionarPessoa} className="bg-green-500 text-white px-4 py-2">Adicionar Pessoa</button>
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
