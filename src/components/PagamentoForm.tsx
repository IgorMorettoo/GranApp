import { useState } from "react";
import type { Grupo, Pagamento } from "../types";

type Props = {
  grupo: Grupo;
  atualizarGrupo: (grupo: Grupo) => void;
};

export default function PagamentoForm({ grupo, atualizarGrupo }: Props) {
  const [de, setDe] = useState<string>("");
  const [para, setPara] = useState<string>("");
  const [valor, setValor] = useState<string>("");

  const registrarPagamento = () => {
    const despesaIndex = grupo.despesas.length - 1;
    if (despesaIndex < 0) {
      alert("Nenhuma despesa encontrada!");
      return;
    }

    if (!de || !para || !valor) {
      alert("Preencha todos os campos!");
      return;
    }

    const novoPagamento: Pagamento = {
      de: parseInt(de),
      para: parseInt(para),
      valor: parseFloat(valor),
    };

    // Cópia imutável das despesas
    const despesasAtualizadas = [...grupo.despesas];
    const despesaAtualizada = {
      ...despesasAtualizadas[despesaIndex],
      pagamentos: [...despesasAtualizadas[despesaIndex].pagamentos, novoPagamento],
    };

    despesasAtualizadas[despesaIndex] = despesaAtualizada;

    atualizarGrupo({ ...grupo, despesas: despesasAtualizadas });

    setDe("");
    setPara("");
    setValor("");
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Registrar Pagamento:</h3>
      <select value={de} onChange={(e) => setDe(e.target.value)} className="border p-2 mr-2">
        <option value="">De</option>
        {grupo.pessoas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <select value={para} onChange={(e) => setPara(e.target.value)} className="border p-2 mr-2">
        <option value="">Para</option>
        {grupo.pessoas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        type="number"
        placeholder="Valor"
        className="border p-2 mr-2"
      />
      <button onClick={registrarPagamento} className="bg-orange-500 text-white px-4 py-2">
        Registrar
      </button>
    </div>
  );
}
