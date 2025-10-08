import { Component, Input, OnInit, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { FiltroTarefas, Tarefa } from '../app.component';

@Component({
  selector: 'app-tarefa-de-lista',
  templateUrl: './tarefa-de-lista.component.html',
  styleUrls: ['./tarefa-de-lista.component.scss']
})
export class TarefaDeListaComponent implements OnChanges {

  @Input() tarefa: Tarefa = {
    titulo: '',
    isConcluida: false
  };
  @Input() indiceTarefa!: number;
  @Output() emissorEventoExcluir: EventEmitter<void> = new EventEmitter();
  @Output() emissorEventoCheckar: EventEmitter<boolean> = new EventEmitter();
  hoje: Date = new Date();
  hovered: boolean = false;
  @Input() filtroTarefas: FiltroTarefas = FiltroTarefas.Todas;
  mostrar: boolean = true;

  constructor() { }

  ngOnChanges(): void {
    if (this.filtroTarefas == FiltroTarefas.Concluidas) {
      if(this.tarefa.isConcluida) this.mostrar = true;
      else this.mostrar = false;
    }
    else if (this.filtroTarefas == FiltroTarefas.Pendentes) {
      if (this.tarefa.isConcluida) this.mostrar = false;
      else this.mostrar = true;
    }
    else if (this.filtroTarefas == FiltroTarefas.Todas) this.mostrar = true;
  }

  emitirEventoExclusao() {
    this.emissorEventoExcluir.emit();
  }

  checkarTarefa(eventoCheckTarefa: Event) {
    this.tarefa.isConcluida = (eventoCheckTarefa.target as HTMLInputElement).checked;
    this.emissorEventoCheckar.emit(this.tarefa.isConcluida);
  }

}
