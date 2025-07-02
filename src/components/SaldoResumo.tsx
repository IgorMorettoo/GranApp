import type { Grupo, Pessoa } from "../types";

type Props = {
  grupo: Grupo;
};

export default function SaldoResumo({ grupo }: Props) {
  function calcularSaldos(grupo: Grupo) {
    // Inicializa saldo de cada pessoa pra cada credor
    const saldos: Record<number, Record<number, number>> = {};

    grupo.pessoas.forEach((p) => {
      saldos[p.id] = {};
      grupo.pessoas.forEach((c) => {
        saldos[p.id][c.id] = 0;
      });
    });

    // Processa as despesas
    grupo.despesas.forEach((d) => {
      d.divisao.forEach((div) => {
        if (div.pessoaId !== d.responsavelId) {
          saldos[div.pessoaId][d.responsavelId] -= div.valor;
          saldos[d.responsavelId][div.pessoaId] += div.valor;
        }
      });

      // Processa pagamentos
      d.pagamentos.forEach((pg) => {
        saldos[pg.de][pg.para] += pg.valor;
        saldos[pg.para][pg.de] -= pg.valor;
      });
    });

    // Monta as relações finais
    const resultados: { devedor: Pessoa; credor: Pessoa; valor: number }[] = [];

    grupo.pessoas.forEach((devedor) => {
      grupo.pessoas.forEach((credor) => {
        const valor = saldos[devedor.id][credor.id];
        if (valor < -0.01) {
          resultados.push({
            devedor,
            credor,
            valor: Math.abs(valor)
          });
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
