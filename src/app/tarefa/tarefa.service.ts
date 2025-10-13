import { Injectable } from '@angular/core';
import { FiltroTarefas, ImportanciaTarefa, Tarefa } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private _tarefas: Tarefa[] = [
    {
      titulo: 'Limpar quintal',
      isConcluida: false,
      dataCriacao: new Date(2025, 9, 1),
      prazo: new Date(2025, 10, 20),
      importancia: ImportanciaTarefa.Alta
    },
    {
      titulo: 'Ir ao médico',
      isConcluida: true,
      dataCriacao: new Date(2025, 9, 2),
      prazo: new Date(2025, 10, 13),
      importancia: ImportanciaTarefa.Baixa
    }
  ]

  constructor() { }

  obterTarefas(filtro: FiltroTarefas, ordem: string): Tarefa[] {
    this.ordenar(ordem);
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

  ordenar(ordem: string) {
    switch (ordem) {
      case 'alfabetica':
        this._tarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        return;
      case 'dataDeCriacao':
        /* <0 → dataA vem antes de dataB
        0 → iguais
        >0 → dataA vem depois de dataB */
        this._tarefas.sort((a, b) => a.dataCriacao.getTime() - b.dataCriacao.getTime());
        return;
      case 'prazo':
        this._tarefas.sort((a, b) => {
          if (!a.prazo && !b.prazo) return 0;
          if (!a.prazo) return 1;
          if (!b.prazo) return -1;
          return a.prazo.getTime() - b.prazo.getTime();
        });
        return;
      default:
        return;
    }
  }

  adicionarTarefa(tarefa: Tarefa): number {
    return this._tarefas.push(tarefa); // retorna o novo tamanho do array
  }

  excluirTarefa(indiceTarefa: number): Tarefa[] {
    return this._tarefas.splice(indiceTarefa, 1); // retorna um array com o elemento excluído
  }

  excluirConcluidas(): void {
    this._tarefas = this._tarefas.filter((tarefa) => !tarefa.isConcluida);
  }

}
