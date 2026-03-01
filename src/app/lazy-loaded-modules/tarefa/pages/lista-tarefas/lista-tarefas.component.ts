import { ParamsBusca } from '../../../../provided-in-root/params-busca.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { map, Observable, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.scss']
})
export class ListaTarefasComponent implements OnInit, OnDestroy {

  state$ = this.activatedRoute.queryParams.pipe(

    map(qp => {
      let params: ParamsBusca = {
        page: Number(qp['page'] ?? 1)
      };
      if (qp['sort'] != undefined) {
        params = {
          ...params,
          sort: qp['sort']
        }
      }
      if (qp['concluida'] != undefined) {
        params = {
          ...params,
          filters: [{
            propriedade: "concluida",
            condicao: "equals",
            valor: qp['concluida']
          }]
        }
      }
      return params;
    }),

    shareReplay(1)
  );

  currentState!: ParamsBusca;

  inscricao!: Subscription;
  tarefas$!: Observable<Tarefa[]>;
  totalTarefas$!: Observable<Number>;
  quantConcluidas$!: Observable<Number>;
  filterSortForm = this.fb.group({
    concluida: new FormControl<boolean | undefined>(undefined),
    sort: new FormControl<string | null>(null)
  });

  constructor(private tarefaService: TarefaService, private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.carregarContagemTarefas();

    // assinamos o state logo no início para atualizar a propriedade currentState sempre que emitir
    this.state$.subscribe(s => {
      this.currentState = s;
      this.carregarTarefas();

      let qpConcluida = s.filters?.find(f => f.propriedade == 'concluida')?.valor as string;
      let concluidaAsBoolean = this.concluidaAsBoolean(qpConcluida);

      this.filterSortForm.patchValue({
        sort: s.sort,
        concluida: concluidaAsBoolean
      }, { emitEvent: false });
    });
    // assinamos os query params da rota logo no início para recarregar tarefas sempre que emitir (inclusive no primeiro carregamento)
    //this.activatedRoute.queryParams.subscribe(() => this.carregarTarefas());

    this.filterSortForm.valueChanges.subscribe(() => this.atualizarfilterSort());
  }

  ngOnDestroy(): void {
    this.inscricao?.unsubscribe();
  }

  private concluidaAsBoolean(qpConcluida: string) {
    switch (qpConcluida) {
      case 'true': return true;
      case 'false': return false;
      default: return undefined;
    }
  }

  private carregarTarefas() {
    this.tarefas$ = this.tarefaService.findAll(this.currentState);
  }

  private carregarContagemTarefas() {
    this.totalTarefas$ = this.tarefaService.countAll();
    this.quantConcluidas$ = this.tarefaService.countConcluidas();
  }

  protected excluirConcluidas(): void {
    this.tarefaService.excluirConcluidas().subscribe({
      next: (resultado) => {
        if (resultado === null) {
          alert('Não há tarefas concluídas para excluir!');
          return;
        }
        this.carregarTarefas();
        this.carregarContagemTarefas();
        alert('Tarefas excluídas com sucesso!');
      },
      error: (err) => alert('Erro ao excluir')
    });
  }

  proximaPagina() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        page: Number(this.activatedRoute.snapshot.queryParamMap.get('page') ?? 1) + 1
      }
    });
  }

  atualizarfilterSort() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        concluida: this.filterSortForm.get('concluida')?.value, // Se for undefined, o Angular remove o param
        sort: this.filterSortForm.get('sort')?.value,
        page: 1
      }
    });
  }

  onExcluida() {
    this.carregarTarefas();
    this.carregarContagemTarefas();
  }

  onConcluida() {
    this.carregarTarefas();
    this.carregarContagemTarefas();
  }


}
