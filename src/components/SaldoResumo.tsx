import { useEffect, useState } from "react";
import type { Grupo } from "../types";

type SaldoAPI = {
  devedor: number;
  credor: number;
  saldo: number | string;
};

type Props = {
  grupo: Grupo;
};

export default function SaldoResumo({ grupo }: Props) {
  const [saldos, setSaldos] = useState<SaldoAPI[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/saldos?grupo_id=${grupo.id}`)
      .then((r) => r.json())
      .then((data) => setSaldos(data))
      .catch(() => setSaldos([]));
  }, [grupo]);

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Saldos:</h3>
      {saldos.length === 0 ? (
        <p className="mt-2">Tudo certo, ninguém deve nada!</p>
      ) : (
        <ul className="mt-2">
          {saldos.map((s, i) => {
            const devedor = grupo.pessoas.find((p) => p.id === s.devedor)?.nome || "(desconhecido)";
            const credor = grupo.pessoas.find((p) => p.id === s.credor)?.nome || "(desconhecido)";
            const saldoValor = Number(s.saldo);

            return (
              <li key={i}>
                {devedor} deve R$ {saldoValor.toFixed(2)} para {credor}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
