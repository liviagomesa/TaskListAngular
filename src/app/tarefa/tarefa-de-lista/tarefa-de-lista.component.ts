import { Component, Input, OnInit, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { FiltroTarefas, ImportanciaTarefa, Tarefa } from '../../app.component';

@Component({
  selector: 'app-tarefa-de-lista',
  templateUrl: './tarefa-de-lista.component.html',
  styleUrls: ['./tarefa-de-lista.component.scss']
})
export class TarefaDeListaComponent implements OnInit {

  @Input() tarefa!: Tarefa;
  @Input() indiceTarefa!: number;
  @Output() emissorEventoExcluir: EventEmitter<void> = new EventEmitter();
  hovered: boolean = false;
  flagColor: string = '';

  constructor() { }

  ngOnInit(): void {
    switch (this.tarefa.importancia) {
      case (ImportanciaTarefa.Alta):
        this.flagColor = 'text-danger';
        break;
      case (ImportanciaTarefa.Media):
        this.flagColor = 'text-warning';
        break;
      case (ImportanciaTarefa.Baixa):
        this.flagColor = 'text-success';
        break;
    }
  }

  emitirEventoExclusao() {
    this.emissorEventoExcluir.emit();
  }

  checkarTarefa(eventoCheckTarefa: Event) {
    this.tarefa.isConcluida = (eventoCheckTarefa.target as HTMLInputElement).checked;
  }

}
