import { Tarefa } from "../../tarefa.types";

export interface TarefaDetailsState {
  dto: Tarefa;
  id: number;
  salvandoConclusao: boolean;
  errorSalvar: boolean;
}
