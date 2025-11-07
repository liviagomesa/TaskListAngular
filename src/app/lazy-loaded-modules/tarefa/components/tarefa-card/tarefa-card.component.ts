import { Component, Input, OnInit, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';

@Component({
  selector: 'app-tarefa-card',
  templateUrl: './tarefa-card.component.html',
  styleUrls: ['./tarefa-card.component.scss']
})
export class TarefaCardComponent implements OnInit {

  @Input() tarefa!: Tarefa;
  hovered: boolean = false;
  flagColor: string = '';

  constructor(private _tarefaService: TarefaService) { }

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

  protected excluirTarefa(): boolean {
    if (confirm("Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.")) {
      return this._tarefaService.deleteById(this.tarefa.id as number);
    }
    return false;
  }

}
