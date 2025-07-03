// src/components/AdicionarDespesaForm.tsx
import type { Grupo, Divisao } from "../types";
import { useState, useEffect } from "react";

type Props = {
  grupo: Grupo;
  atualizarGrupo: (grupo: Grupo) => void;
};

export default function AdicionarDespesaForm({ grupo, atualizarGrupo }: Props) {
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [pagadorId, setPagadorId] = useState<number>(grupo.pessoas[0]?.id || 0);
  const [tipoDivisao, setTipoDivisao] = useState<"igual" | "personalizada">("igual");
  const [valoresPersonalizados, setValoresPersonalizados] = useState<Record<number, string>>({});

  useEffect(() => {
    if (grupo.pessoas.length > 0) {
      setPagadorId(grupo.pessoas[0].id);
    }
  }, [grupo.pessoas]);

  const adicionarDespesa = async () => {
    const valorTotal = parseFloat(valor);
    if (isNaN(valorTotal) || valorTotal <= 0) {
      alert("Informe um valor válido para a despesa.");
      return;
    }
    if (!descricao.trim()) {
      alert("Informe a descrição da despesa.");
      return;
    }

    let divisao: Divisao[] = [];

    if (tipoDivisao === "igual") {
      const participantes = grupo.pessoas;
      const valorPorPessoa = valorTotal / participantes.length;
      divisao = participantes.map((p) => ({
        pessoaId: p.id,
        valor: valorPorPessoa,
      }));
    } else {
      const participantes = grupo.pessoas;
      divisao = participantes.map((p) => ({
        pessoaId: p.id,
        valor: parseFloat(valoresPersonalizados[p.id]) || 0,
      }));

      const totalDividido = divisao.reduce((s, d) => s + d.valor, 0);
      if (Math.abs(totalDividido - valorTotal) > 0.01) {
        alert("A soma dos valores personalizados precisa ser igual ao valor total.");
        return;
      }
    }

    try {
      const resp = await fetch("http://localhost:3001/api/despesas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao,
          valor: valorTotal,
          responsavel_id: pagadorId,
          grupo_id: grupo.id,
          divisao,
        }),
      });

      if (!resp.ok) {
        alert("Erro ao cadastrar despesa!");
        return;
      }

      const resPessoas = await fetch(`http://localhost:3001/api/pessoas?grupo_id=${grupo.id}`);
      const pessoas = await resPessoas.json();

      const resDespesas = await fetch(`http://localhost:3001/api/despesas?grupo_id=${grupo.id}`);
      const despesas = await resDespesas.json();

      const resPagamentos = await fetch(`http://localhost:3001/api/pagamentos?grupo_id=${grupo.id}`);
      const pagamentos = await resPagamentos.json();

      atualizarGrupo({
        ...grupo,
        pessoas,
        despesas,
        pagamentos,
      });

      setDescricao("");
      setValor("");
      setValoresPersonalizados({});
    } catch (error) {
      alert("Erro ao conectar no backend! " + error);
    }
  };

  const handleValorPersonalizadoChange = (pessoaId: number, novoValor: string) => {
    setValoresPersonalizados((prev) => ({ ...prev, [pessoaId]: novoValor }));
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Adicionar Despesa:</h3>

      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
        className="border p-2 mr-2"
      />

      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Valor"
        type="number"
        className="border p-2 mr-2"
      />

      <select
        value={pagadorId}
        onChange={(e) => setPagadorId(Number(e.target.value))}
        className="border p-2 mr-2"
      >
        {grupo.pessoas.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>

      <select
        value={tipoDivisao}
        onChange={(e) => setTipoDivisao(e.target.value as "igual" | "personalizada")}
        className="border p-2 mr-2"
      >
        <option value="igual">Dividir igualmente</option>
        <option value="personalizada">Dividir personalizada</option>
      </select>

      {tipoDivisao === "personalizada" && (
        <div className="mt-2">
          {grupo.pessoas.map((p) => (
            <div key={p.id} className="flex items-center mb-1">
              <span className="w-24">{p.nome}</span>
              <input
                type="number"
                value={valoresPersonalizados[p.id] || ""}
                onChange={(e) => handleValorPersonalizadoChange(p.id, e.target.value)}
                placeholder="Valor"
                className="border p-1"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={adicionarDespesa}
        className="bg-purple-500 text-white px-4 py-2 mt-2"
      >
        Adicionar
      </button>
    </div>
  );
}
