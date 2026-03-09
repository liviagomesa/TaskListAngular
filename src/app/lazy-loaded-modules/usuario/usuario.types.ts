export interface Usuario {
  id?: number;
  email: string;
  password: string;
  endereco?: Endereco;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: Cidade;
  estado: Estado;
}

export interface Estado {
  id:    number;
  sigla: string;
  nome:  string;
}

export interface Cidade {
  ID:     number;
  Nome:   string;
  Estado: number;
}
