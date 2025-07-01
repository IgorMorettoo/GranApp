import type { Grupo, Pessoa } from "../types";

type Props = {
  grupo: Grupo;
};

export default function SaldoResumo({ grupo }: Props) {
  // Função para calcular os saldos devidos
  function calcularSaldos(grupo: Grupo) {
    const saldos: Record<number, number> = {};

    grupo.pessoas.forEach((p) => (saldos[p.id] = 0));

    grupo.despesas.forEach((d) => {
      d.divisao.forEach((div) => {
        saldos[div.pessoaId] -= div.valor;
        saldos[d.responsavelId] += div.valor;
      });

      d.pagamentos.forEach((pg) => {
        saldos[pg.de] += pg.valor;
        saldos[pg.para] -= pg.valor;
      });
    });

    const devedores = Object.entries(saldos)
      .filter(([_, v]) => v < -0.01)
      .map(([id, saldo]) => ({ id: Number(id), saldo }));

    const credores = Object.entries(saldos)
      .filter(([_, v]) => v > 0.01)
      .map(([id, saldo]) => ({ id: Number(id), saldo }));

    const resultados: { devedor: Pessoa; credor: Pessoa; valor: number }[] = [];

    devedores.forEach((devedor) => {
      credores.forEach((credor) => {
        if (devedor.saldo < 0 && credor.saldo > 0) {
          const valor = Math.min(Math.abs(devedor.saldo), credor.saldo);
          if (valor > 0.01) {
            const pDevedor = grupo.pessoas.find((p) => p.id === devedor.id)!;
            const pCredor = grupo.pessoas.find((p) => p.id === credor.id)!;
            resultados.push({ devedor: pDevedor, credor: pCredor, valor });

            devedor.saldo += valor;
            credor.saldo -= valor;
          }
        }
      });
    });

    return resultados;
  }

  const relacoes = calcularSaldos(grupo);

  return (
    <div className="mt-4">
      <h3 className="font-semibold">Saldos:</h3>
      {relacoes.length === 0 ? (
        <p>Tudo certo, ninguém deve nada!</p>
      ) : (
        <ul>
          {relacoes.map(({ devedor, credor, valor }, i) => (
            <li key={i} className="mt-8">
              {devedor.nome} deve R$ {valor.toFixed(2)} para {credor.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
