import type { Grupo } from "../types";

type Props = {
  grupo: Grupo;
};

export default function SaldoResumo({ grupo }: Props) {
  const saldos: Record<number, Record<number, number>> = {};

  // Inicializa matriz
  grupo.pessoas.forEach((p) => {
    saldos[p.id] = {};
    grupo.pessoas.forEach((c) => {
      saldos[p.id][c.id] = 0;
    });
  });

  // Processa despesas
  grupo.despesas.forEach((despesa) => {
    despesa.divisao.forEach((div) => {
      if (div.pessoaId !== despesa.responsavelId) {
        saldos[div.pessoaId][despesa.responsavelId] -= div.valor;
        saldos[despesa.responsavelId][div.pessoaId] += div.valor;
      }
    });
  });

  // Processa pagamentos
  grupo.pagamentos.forEach((pagamento) => {
    saldos[pagamento.de][pagamento.para] += pagamento.valor;
    saldos[pagamento.para][pagamento.de] -= pagamento.valor;
  });

  const linhas: string[] = [];
  grupo.pessoas.forEach((p) => {
    grupo.pessoas.forEach((c) => {
      if (p.id !== c.id) {
        const saldo = +(saldos[p.id]?.[c.id] ?? 0);
        if (saldo > 0.01) {
          linhas.push(`${p.nome} deve R$ ${saldo.toFixed(2)} para ${c.nome}`);
        } else if (saldo < -0.01) {
          linhas.push(`${c.nome} tem crédito de R$ ${Math.abs(saldo).toFixed(2)} com ${p.nome}`);
        }
      }
    });
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
