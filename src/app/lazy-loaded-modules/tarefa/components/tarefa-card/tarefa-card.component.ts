import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Tarefa } from '../../tarefa.model';

@Component({
  selector: 'app-tarefa-card',
  templateUrl: './tarefa-card.component.html',
  styleUrls: ['./tarefa-card.component.scss']
})
export class TarefaCardComponent implements OnInit {

  @Input() tarefa!: Tarefa;
  hovered: boolean = false;
  flagColor: string = '';
  @Output() excluida = new EventEmitter<void>();
  @Output() concluida = new EventEmitter<void>();

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

  protected excluirTarefa(): void {
    if (confirm("Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.")) {
      this.excluida.emit();
    }
  }

  protected checkTarefa(): void {
    this.concluida.emit();
  }

}
