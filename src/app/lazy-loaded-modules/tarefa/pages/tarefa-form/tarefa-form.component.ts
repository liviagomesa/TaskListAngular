import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { novaTarefa } from '../../tarefa.model';
import { Utils } from 'src/app/provided-in-root/utils';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.component.html',
  styleUrls: ['./tarefa-form.component.scss']
})
// caso rota de edição, antes de carregar este componente, o resolver busca a tarefa do id fornecido e salva em activatedRoute.data (que é um observable)
export class TarefaFormComponent extends BaseFormComponent implements OnInit, OnDestroy {

  // TODO: Ver se algo precisa ser feito com esse prazo!
  textoInputPrazo!: string; // O input[type=date] entrega uma string e o Angular não converte automaticamente para Date
  @ViewChild('inputTitulo') inputTitulo!: ElementRef; // acessando a variável local do template diretamente
  opcoesImportancia = Object.values(ImportanciaTarefa);
  inscricao!: Subscription;
  tarefa!: Tarefa; // vem do resolver

  constructor(
    private _tarefaService: TarefaService,
    activatedRoute: ActivatedRoute,
    router: Router) {
    super(router, activatedRoute);
  }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

  // obs.: se o id for inválido, este método nem chegará a ser executado, pois o resolver roda antes e encaminha para not-found
  override ngOnInit(): void {
    super.ngOnInit();
    // activatedRoute.data sempre emite quando a rota é aberta, em qualquer rota! mas não necessariamente existe o campo t
    this.inscricao = this.activatedRoute.data.subscribe(
      (objetoEmitidoRota: any) => {
        const original = objetoEmitidoRota['t'] ?? novaTarefa();
        // Faz uma cópia para não editar diretamente o objeto original retornado do serviço
        this.tarefa = { ...original };
        this.textoInputPrazo = this.tarefa.prazo?.toISOString().substring(0, 10) ?? '';
      }
    )
  }

  override submit(): void {
    //this.tarefa.prazo = Utils.parseDateLocal(this.textoInputPrazo);
    this._tarefaService.save(this.tarefa);
  }

}
