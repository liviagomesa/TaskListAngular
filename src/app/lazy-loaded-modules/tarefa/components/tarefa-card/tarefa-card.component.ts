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
  @Output() excluida = new EventEmitter<void>();
  @Output() concluida = new EventEmitter<void>();

  constructor(private tarefaService: TarefaService) { }

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
      this.tarefaService.deleteById(this.tarefa.id as number).subscribe({
        next: () => this.excluida.emit(),
        error: erro => alert(`Erro na exclusão da tarefa: ${erro}`)
      });
    }
  }

  protected checkTarefa(): void {
    this.tarefaService.toggleConclusaoById(this.tarefa.id as number).subscribe({
      next: () => this.concluida.emit(),
      error: erro => alert(`Erro na conclusão da tarefa: ${erro}`)
    });
  }

}
