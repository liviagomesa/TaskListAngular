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
  textoInputPrazo: string = ''; // O input[type=date] entrega uma string e o Angular não converte automaticamente para Date
  importanciaTarefa: ImportanciaTarefa | null = null;
  @ViewChild('inputTarefa') inputTarefa!: ElementRef; // acessando a variável local do template diretamente
  filtros = Object.values(FiltroTarefas); // [ "Todas", "Pendentes", "Concluídas" ]
  opcoesImportancia = Object.values(ImportanciaTarefa);
  ordemAplicada: string = '';

  get totalTarefas(): number {
    return this.tarefas.length;
  }

  get quantConcluidas(): number {
    return this.tarefas.filter(t => t.isConcluida).length;
  }

  get tarefas(): Tarefa[] {
    return this._tarefaService.obterTarefas(this.filtroAplicado, this.ordemAplicada);
  }

  constructor(private _tarefaService: TarefaService) {
  }

  protected adicionarTarefa(): void {
    if (!this.textoInputTarefa.trim()) return; // evita tarefa vazia
    this._tarefaService.adicionarTarefa({
      titulo: this.textoInputTarefa,
      isConcluida: false,
      dataCriacao: new Date(),
      prazo: this.textoInputPrazo ? new Date(this.textoInputPrazo) : null,
      importancia: this.importanciaTarefa
    });
    this.textoInputTarefa = '';
    this.inputTarefa.nativeElement.focus();
  }

  protected excluirTarefa(indiceTarefa: number): void {
    this._tarefaService.excluirTarefa(indiceTarefa);
  }

  protected excluirConcluidas(): void {
    this._tarefaService.excluirConcluidas();
  }

}

export interface Tarefa {
    titulo: string,
    isConcluida: boolean,
    dataCriacao: Date,
    prazo: Date | null,
    importancia: ImportanciaTarefa | null
}

export enum FiltroTarefas {
  Todas = 'Todas',
  Pendentes = 'Pendentes',
  Concluidas = 'Concluídas'
}

export enum ImportanciaTarefa {
  Alta = 'Alta',
  Media = 'Média',
  Baixa = 'Baixa'
}
