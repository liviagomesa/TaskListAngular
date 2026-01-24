import { ImportanciaTarefa } from "./enums/importancia-tarefa.enum";

export interface Tarefa {
    id: number | null,
    titulo: string,
    anotacoes: string | null,
    concluida: boolean,
    dataCriacao: Date,
    prazo: Date | null,
    importancia: ImportanciaTarefa | null,
    subtarefas: Subtarefa[] | null,
    tags: string[] | null
}

export interface Subtarefa {
  id: number | null,
  titulo: string,
  concluida: boolean,
  dataCriacao: Date,
  prazo: Date | null
}

export function novaSubtarefa(): Subtarefa {
  return {
    id: null,
    titulo: '',
    concluida: false,
    dataCriacao: new Date(),
    prazo: null
  };
}
