import { Injectable } from '@angular/core';
import { FiltroTarefas, Tarefa } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private _tarefas: Tarefa[] = [
    {
      titulo: 'Limpar quintal',
      isConcluida: false,
      dataCriacao: new Date(2025, 9, 1)
    },
    {
      titulo: 'Ir ao médico',
      isConcluida: true,
      dataCriacao: new Date(2025, 9, 2)
    }
  ]

  constructor() { }

  obterTarefas(filtro: FiltroTarefas): Tarefa[] {
    switch (filtro) {
      case FiltroTarefas.Todas:
        return this._tarefas;
      case FiltroTarefas.Pendentes:
        return this._tarefas.filter(t => t.isConcluida == false);
      case FiltroTarefas.Concluidas:
        return this._tarefas.filter(t => t.isConcluida == true);
      default:
        return this._tarefas;
    }
  }

  adicionarTarefa(tarefa: Tarefa): number {
    return this._tarefas.push(tarefa); // retorna o novo tamanho do array
  }

  excluirTarefa(indiceTarefa: number): Tarefa[] {
    return this._tarefas.splice(indiceTarefa, 1); // retorna um array com o elemento excluído
  }

}
