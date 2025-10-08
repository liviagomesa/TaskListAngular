import { Component, Input, OnInit, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { FiltroTarefas, Tarefa } from '../../app.component';

@Component({
  selector: 'app-tarefa-de-lista',
  templateUrl: './tarefa-de-lista.component.html',
  styleUrls: ['./tarefa-de-lista.component.scss']
})
export class TarefaDeListaComponent implements OnChanges {

  @Input() tarefa!: Tarefa;
  @Input() indiceTarefa!: number;
  @Output() emissorEventoExcluir: EventEmitter<void> = new EventEmitter();
  hovered: boolean = false;

  constructor() { }

  ngOnChanges(): void { }

  emitirEventoExclusao() {
    this.emissorEventoExcluir.emit();
  }

  checkarTarefa(eventoCheckTarefa: Event) {
    this.tarefa.isConcluida = (eventoCheckTarefa.target as HTMLInputElement).checked;
  }

}
