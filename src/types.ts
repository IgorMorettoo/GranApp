export type Pessoa = {
  id: number;
  nome: string;
};

export type Divisao = {
  pessoaId: number;
  valor: number;
};

export type Pagamento = {
  id: number;
  de: number;
  para: number;
  valor: number;
  grupo_id: number;
};

export type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  responsavelId: number;
  divisao: Divisao[];
};

export type Grupo = {
  id: number;
  nome: string;
  pessoas: Pessoa[];
  despesas: Despesa[];
  pagamentos: Pagamento[];
  saldos: { de: number; para: number; saldo: number }[];
};
