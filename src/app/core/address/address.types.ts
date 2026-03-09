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

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
