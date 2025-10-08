import { Component, ElementRef, ViewChild } from '@angular/core';
import { TarefaService } from './tarefa/tarefa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  filtroAplicado: FiltroTarefas = FiltroTarefas.Todas; // "Todas" ou "Pendentes" ou "Concluídas"
  textoInputTarefa: string = '';
  @ViewChild('inputTarefa') inputTarefa!: ElementRef; // acessando a variável local do template diretamente
  filtros = Object.values(FiltroTarefas); // [ "Todas", "Pendentes", "Concluídas" ]

  get totalTarefas(): number {
    return this.tarefas.length;
  }

  get quantConcluidas(): number {
    return this.tarefas.filter(t => t.isConcluida).length;
  }

  get tarefas(): Tarefa[] {
    return this._tarefaService.obterTarefas(this.filtroAplicado);
  }

  constructor(private _tarefaService: TarefaService) {
  }

  adicionarTarefa() {
    if (!this.textoInputTarefa.trim()) return; // evita tarefa vazia
    this._tarefaService.adicionarTarefa({
      titulo: this.textoInputTarefa,
      isConcluida: false,
      dataCriacao: new Date()
    });
    this.textoInputTarefa = '';
    this.inputTarefa.nativeElement.focus();
  }

  excluirTarefa(indiceTarefa: number) {
    this._tarefaService.excluirTarefa(indiceTarefa);
  }

}

export interface Tarefa {
    titulo: string,
    isConcluida: boolean,
    dataCriacao: Date
}

export enum FiltroTarefas {
  Todas = 'Todas',
  Pendentes = 'Pendentes',
  Concluidas = 'Concluídas'
}

/* TODO: Ideias Marina
- adicionar prazo
- adicionar flag de importância (3 níveis)
- desabilitar botao de + se não tiver texto no input
- trocar botao lixeira por um icone de X no canto superior direito da tarefa
- Pressionar Enter no input já adiciona a tarefa.
- Botão “Excluir todas as concluídas”.
- Ordenação por data de criação, prazo ou alfabética.
*/
