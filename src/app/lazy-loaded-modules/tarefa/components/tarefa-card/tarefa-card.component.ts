import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Tarefa } from '../../tarefa.types';

@Component({
  selector: 'app-tarefa-card',
  templateUrl: './tarefa-card.component.html',
  styleUrls: ['./tarefa-card.component.scss']
})
export class TarefaCardComponent {

  @Input() tarefa!: Tarefa;
  hovered: boolean = false;
  @Output() excluida = new EventEmitter<void>();
  @Output() concluida = new EventEmitter<void>();

  get flagColor() {
    switch (this.tarefa.importancia) {
      case (ImportanciaTarefa.Alta): return 'text-danger';
      case (ImportanciaTarefa.Media): return 'text-warning';
      case (ImportanciaTarefa.Baixa): return 'text-success';
      default: return '';
    }
  }

  constructor() { }

  protected excluirTarefa(): void {
    if (confirm("Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.")) {
      this.excluida.emit();
    }
  }

  protected checkTarefa(): void {
    this.concluida.emit();
  }

}
