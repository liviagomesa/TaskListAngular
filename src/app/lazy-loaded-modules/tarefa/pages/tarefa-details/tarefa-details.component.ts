import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tarefa-details',
  templateUrl: './tarefa-details.component.html',
  styleUrls: ['./tarefa-details.component.scss']
})
export class TarefaDetailsComponent implements OnInit {

  tarefa!: Tarefa; // vem do resolver
  inscricao!: Subscription;

  constructor(private tarefaService: TarefaService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

  // obs.: se o id for inválido, este método nem chegará a ser executado, pois o resolver roda antes e encaminha para not-found
  ngOnInit(): void {
    // activatedRoute.data sempre emite quando a rota é aberta, em qualquer rota! mas não necessariamente existe o campo t
    this.inscricao = this.activatedRoute.data.subscribe(
      (objetoEmitidoRota: any) => {
        this.tarefa = objetoEmitidoRota['entity'] ?? this.tarefaService.newEntity();
      }
    )
  }

  toggleConclusao() {
    this.tarefa.concluida = !this.tarefa.concluida;
  }

}
