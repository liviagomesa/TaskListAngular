import { Injectable } from '@angular/core';
import { FiltroTarefas } from './enums/filtro-tarefas.enum';
import { ImportanciaTarefa } from './enums/importancia-tarefa.enum';
import { Tarefa } from './tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private _tarefas: Tarefa[] = [
    {
      id: 1,
      titulo: 'Limpar quintal',
      isConcluida: false,
      dataCriacao: new Date(2025, 9, 1),
      prazo: new Date(2025, 10, 20),
      importancia: ImportanciaTarefa.Alta
    },
    {
      id: 2,
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

  save(tarefa: Tarefa): Tarefa {
    if (!tarefa.id) {
      tarefa.id = this._tarefas.length == 0 ? 1 : Math.max(...this._tarefas.map((t: Tarefa) => t.id as number)) + 1;
      this._tarefas.push(tarefa);
    } else {
      const index: number = this.getIndexById(tarefa.id);
      this._tarefas[index] = tarefa;
    }
    return tarefa;
  }

  deleteById(id: number): boolean {
    const index: number = this.getIndexById(id);
    if (index == -1) return false;
    this._tarefas.splice(index, 1);
    return true;
  }

  excluirConcluidas(): void {
    this._tarefas = this._tarefas.filter((t: Tarefa) => !t.isConcluida);
  }

  getById(id: number): Tarefa | undefined {
    return this._tarefas.find((t: Tarefa) => t.id == id);
  }

  getIndexById(id: number): number {
    return this._tarefas.findIndex((t: Tarefa) => t.id == id);
  }

  toggleConclusaoById(id: number): void {
    this._tarefas[this.getIndexById(id)].isConcluida = !this._tarefas[this.getIndexById(id)].isConcluida;
  }

}
