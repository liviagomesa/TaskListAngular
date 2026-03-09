import { Cidade, Estado } from 'src/app/core/address/address.types';

export { Cidade, Estado };

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
