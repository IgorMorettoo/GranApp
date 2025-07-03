// src/components/SaldoResumo.tsx
import { useEffect, useState } from "react";
import type { Grupo } from "../types";

type Props = {
  grupo: Grupo;
};

type SaldoApi = {
  devedor: number;
  credor: number;
  saldo: number | string;
};

export default function SaldoResumo({ grupo }: Props) {
  const [saldos, setSaldos] = useState<SaldoApi[]>([]);

  useEffect(() => {
    const fetchSaldos = async () => {
      const res = await fetch(`http://localhost:3001/api/saldos?grupo_id=${grupo.id}`);
      const data = await res.json();
      setSaldos(data);
    };
    fetchSaldos();
  }, [grupo.id, grupo.despesas, grupo.pagamentos]);

  const linhas: string[] = [];

  saldos.forEach((s) => {
    const devedorNome = grupo.pessoas.find((p) => p.id === Number(s.devedor))?.nome ?? "(desconhecido)";
    const credorNome = grupo.pessoas.find((p) => p.id === Number(s.credor))?.nome ?? "(desconhecido)";
    const saldoNum = Number(s.saldo);

    if (saldoNum > 0.01) {
      linhas.push(`${devedorNome} deve R$ ${saldoNum.toFixed(2)} para ${credorNome}`);
    } else if (saldoNum < -0.01) {
      linhas.push(`${credorNome} deve R$ ${Math.abs(saldoNum).toFixed(2)} para ${devedorNome}`);
    }
  });

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Saldos:</h3>
      {linhas.length === 0 ? (
        <p className="mt-2">Tudo certo, ninguém deve nada!</p>
      ) : (
        <ul className="mt-2">
          {linhas.map((linha, i) => (
            <li key={i}>{linha}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
