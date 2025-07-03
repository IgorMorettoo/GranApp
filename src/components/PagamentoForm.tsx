import { useState, useEffect } from "react";
import type { Grupo } from "../types";

type Props = {
  grupo: Grupo;
  atualizarGrupo: (grupo: Grupo) => void;
};

export default function PagamentoForm({ grupo, atualizarGrupo }: Props) {
  const [de, setDe] = useState<number>(-1);
  const [para, setPara] = useState<number>(-1);
  const [valor, setValor] = useState<string>("");

  const calcularSaldoEntre = (deId: number, paraId: number): number => {
    let saldo = 0;
    for (const desp of grupo.despesas) {
      for (const div of desp.divisao) {
        if (div.pessoaId !== desp.responsavelId) {
          if (div.pessoaId === deId && desp.responsavelId === paraId) {
            saldo += div.valor;
          }
          if (div.pessoaId === paraId && desp.responsavelId === deId) {
            saldo -= div.valor;
          }
        }
      }
    }
    for (const pag of grupo.pagamentos) {
      if (pag.de === deId && pag.para === paraId) saldo -= pag.valor;
      if (pag.de === paraId && pag.para === deId) saldo += pag.valor;
    }
    return saldo;
  };

  useEffect(() => {
    let encontrou = false;
    for (const p of grupo.pessoas) {
      for (const c of grupo.pessoas) {
        if (p.id !== c.id) {
          if (calcularSaldoEntre(p.id, c.id) > 0.01) {
            setDe(p.id);
            setPara(c.id);
            encontrou = true;
            break;
          }
        }
      }
      if (encontrou) break;
    }
    if (!encontrou && grupo.pessoas.length >= 2) {
      setDe(grupo.pessoas[0].id);
      setPara(grupo.pessoas[1].id);
    }
  }, [grupo.pessoas, grupo.despesas, grupo.pagamentos]);

  const registrarPagamento = async () => {
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert("Informe um valor válido.");
      return;
    }
    if (de === para) {
      alert("Selecione pessoas diferentes.");
      return;
    }

    const saldoAtual = calcularSaldoEntre(de, para);
    if (saldoAtual <= 0) {
      alert("Não há saldo devedor entre essas pessoas.");
      return;
    }
    if (valorNum > saldoAtual) {
      alert(`O valor excede o saldo devedor de R$ ${saldoAtual.toFixed(2)}.`);
      return;
    }

    const resp = await fetch("http://localhost:3001/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ de, para, valor: valorNum, grupo_id: grupo.id }),
    });

    if (!resp.ok) {
      alert("Erro ao registrar pagamento.");
      return;
    }

    await atualizarGrupo(grupo);

    setValor("");
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Registrar Pagamento:</h3>
      <select value={de} onChange={(e) => setDe(Number(e.target.value))} className="border p-2 mr-2">
        {grupo.pessoas.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      →
      <select value={para} onChange={(e) => setPara(Number(e.target.value))} className="border p-2 ml-2 mr-2">
        {grupo.pessoas.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Valor"
        type="number"
        className="border p-2 mr-2"
      />
      <button
        onClick={registrarPagamento}
        className="bg-green-500 text-white px-4 py-2"
        disabled={grupo.pessoas.length < 2}
      >
        Registrar Pagamento
      </button>
    </div>
  );
}
