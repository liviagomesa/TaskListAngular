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
    tags: Tag[] | null
}

export interface Subtarefa {
  id: number | null,
  tarefaId: number | null,
  titulo: string,
  concluida: boolean,
  dataCriacao: Date,
  prazo: Date | null
}

export interface Tag {
  id: number | null,
  tarefaId: number | null,
  nome: string
}

export function createEmptyTarefa(): Tarefa {
  return {
    id: null,
    titulo: '',
    anotacoes: null,
    concluida: false,
    dataCriacao: new Date(),
    prazo: null,
    importancia: null,
    subtarefas: null,
    tags: null
  };
}
