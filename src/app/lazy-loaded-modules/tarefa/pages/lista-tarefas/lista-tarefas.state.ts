import { Tarefa } from "../../tarefa.types";

/** A interface que define a forma do estado da tela de listagem de tarefas */
export interface ListaTarefasState {
  lista: Tarefa[];       // quais tarefas estão na lista agora?
  total: number;         // quantas tarefas existem no total agora?
  concluidas: number;    // quantas estão concluídas agora?
  page: number;
  sort: string | null;
  filtrarConcluidas: boolean | undefined;
  loadingDados: boolean;      // estamos esperando o servidor responder agora? (carregar lista com filtros/ordenações)
  errorDados: boolean;        // deu erro agora? (nas mesmas situações acima)
  excluindoConcluidas: boolean;
  errorExcluirConcluidas: boolean;
  salvandoConclusao: boolean;
  errorSalvarConclusao: boolean;
  excluindoTarefa: boolean;
  errorExcluirTarefa: boolean;
}

export const initialListaTarefasState: ListaTarefasState = {
  lista: [],
  total: 0,
  concluidas: 0,
  page: 1,
  sort: null,
  filtrarConcluidas: undefined,
  loadingDados: false,
  errorDados: false,
  excluindoConcluidas: false,
  errorExcluirConcluidas: false,
  salvandoConclusao: false,
  errorSalvarConclusao: false,
  excluindoTarefa: false,
  errorExcluirTarefa: false
}
