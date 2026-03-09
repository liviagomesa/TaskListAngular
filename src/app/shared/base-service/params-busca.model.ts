export type ParamsBusca = {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Filtro[]
}

export type Filtro<T = string | number | boolean> = {
  propriedade: string;
  condicao: CondicaoFiltro;
  valor: T;
}

export type CondicaoFiltro = "equals" | "lt" | "lte" | "gt" | "gte" | "ne";
