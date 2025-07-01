import type { Grupo, Despesa, Divisao } from "../types";
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

  const adicionarDespesa = () => {
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
      const participantes = grupo.pessoas; // inclui pagador também
      const valorPorPessoa = valorTotal / participantes.length;

      divisao = participantes.map((p) => ({
        pessoaId: p.id,
        valor: valorPorPessoa,
      }));
    } else {
      // divisão personalizada
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

    const novaDespesa: Despesa = {
      id: Date.now(),
      descricao,
      valor: valorTotal,
      responsavelId: pagadorId,
      divisao,
      pagamentos: [],
    };

    atualizarGrupo({ ...grupo, despesas: [...grupo.despesas, novaDespesa] });
    setDescricao("");
    setValor("");
    setValoresPersonalizados({});
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
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
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

      <div className="mt-6">
        <h4 className="font-semibold">Despesas cadastradas:</h4>
        {grupo.despesas.length === 0 ? (
          <p className="mt-7">Nenhuma despesa adicionada ainda.</p>
        ) : (
          <ul>
            {grupo.despesas.map((d) => (
              <li key={d.id} className="mb-2">
                <span className="descricao-despesa">{d.descricao}</span>: R$ {d.valor.toFixed(2)} - Pago por:{" "}
                {grupo.pessoas.find((p) => p.id === d.responsavelId)?.nome || "Desconhecido"}
                <br />
                Divisão:{" "}
                {d.divisao
                  .map(
                    (div) =>
                      `${grupo.pessoas.find((p) => p.id === div.pessoaId)?.nome || "?"} deve R$ ${div.valor.toFixed(2)}`
                  )
                  .join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
