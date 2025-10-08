import { Component } from '@angular/core';
import { TarefasService } from './tarefas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tarefas: Tarefa[] = this._tarefasService.getAllTarefas();
  totalTarefas: number = this.tarefas.length;
  quantConcluidas: number = this.tarefas.filter(t => t.isConcluida).length;
  filtro: FiltroTarefas = FiltroTarefas.Todas;
  FiltroTarefas = FiltroTarefas; // expõe o enum para o template

  constructor(private _tarefasService: TarefasService) {}

  salvarTarefa(inputTarefa: HTMLInputElement) {
    this.tarefas.push({
      titulo: inputTarefa.value,
      isConcluida: false
    });
    this.totalTarefas++;
    inputTarefa.value = '';
    inputTarefa.focus();
  }

  excluirTarefa(indiceTarefa: number) {
    if(this.tarefas.at(indiceTarefa)?.isConcluida) this.quantConcluidas--;
    this.tarefas.splice(indiceTarefa, 1);
    this.totalTarefas--;
  }

  checkarTarefa(isConclusao: boolean) {
    if(isConclusao) this.quantConcluidas++;
    else this.quantConcluidas--;
  }

}

export interface Tarefa {
    titulo: string,
    isConcluida: boolean
}

export enum FiltroTarefas {
  Pendentes,
  Concluidas,
  Todas
}
