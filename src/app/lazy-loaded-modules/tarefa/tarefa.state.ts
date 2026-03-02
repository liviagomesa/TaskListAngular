import { Tarefa } from "./tarefa.model";

export interface TarefaState {
  dados: Tarefa[];
  total: number;
  concluidas: number;
  loading: boolean;
  error: boolean;
}

export const initialTarefaState: TarefaState = {
  dados: [],
  total: 0,
  concluidas: 0,
  loading: true,
  error: false
}

export const errorTarefaState: TarefaState = {
  dados: [],
  total: 0,
  concluidas: 0,
  loading: false,
  error: true
}
