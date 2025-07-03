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


      <div className="mt-4">
        <h3 className="font-semibold">Despesas Cadastradas:</h3>
        {grupo.despesas.length === 0 ? (
          <p className="mt-2">Nenhuma despesa cadastrada ainda.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {grupo.despesas.map((d) => (
              <li key={d.id} className="border p-2 rounded">
                <div><strong>{d.descricao}</strong> - R$ {Number(d.valor).toFixed(2)}</div>
                <div>Responsável: {grupo.pessoas.find(p => p.id === d.responsavelId)?.nome ?? "Desconhecido"}</div>
                <div>
                  Divisão:
                  <ul className="list-disc ml-5">
                    {d.divisao.map((div, i) => (
                      <li key={i}>
                        {grupo.pessoas.find(p => p.id === div.pessoaId)?.nome ?? "Desconhecido"} deve R$ {Number(div.valor).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
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
