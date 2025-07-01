export type Pessoa = {
  id: number;
  nome: string;
};

export type Divisao = {
  pessoaId: number;
  valor: number;
};

export type Pagamento = {
  de: number;
  para: number;
  valor: number;
};

export type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  responsavelId: number;
  divisao: Divisao[];
  pagamentos: Pagamento[];
};

export type Grupo = {
  id: number;
  nome: string;
  pessoas: Pessoa[];
  despesas: Despesa[];
};
