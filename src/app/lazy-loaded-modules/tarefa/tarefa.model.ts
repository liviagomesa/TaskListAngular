import { ImportanciaTarefa } from "./enums/importancia-tarefa.enum";

export interface Tarefa {
    id: number | null,
    titulo: string,
    isConcluida: boolean,
    dataCriacao: Date,
    prazo: Date | null,
    importancia: ImportanciaTarefa | null
}

export function novaTarefa(): Tarefa {
  return {
    id: null,
    titulo: '',
    isConcluida: false,
    dataCriacao: new Date(),
    prazo: null,
    importancia: null
  };
}
