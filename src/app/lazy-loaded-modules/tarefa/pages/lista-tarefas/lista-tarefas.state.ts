import { Tarefa } from "../../tarefa.model";

/** A interface que define a forma do estado da tela de listagem de tarefas */
export interface ListaTarefasState {
  dados: Tarefa[];       // quais tarefas estão na lista agora?
  total: number;         // quantas tarefas existem no total agora?
  concluidas: number;    // quantas estão concluídas agora?
  loading: boolean;      // estamos esperando o servidor responder agora?
  error: boolean;        // deu erro agora?
}

export const initialListaTarefasState: ListaTarefasState = {
  dados: [],
  total: 0,
  concluidas: 0,
  loading: false,
  error: false
}
