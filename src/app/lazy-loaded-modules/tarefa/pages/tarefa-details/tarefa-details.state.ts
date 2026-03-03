import { Tarefa } from "../../tarefa.model";

export interface TarefaDetailsState {
  dto: Tarefa;
  id: number;
  salvandoConclusao: boolean;
  errorSalvar: boolean;
}
