import { ParamsBusca } from '../../../../provided-in-root/params-busca.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, shareReplay, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { errorTarefaState, initialTarefaState, TarefaState } from '../../tarefa.state';
import { TarefaStore } from '../../tarefa.store';
import { mapQpToParamsBusca } from '../../tarefa.mapper';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.scss']
})
export class ListaTarefasComponent implements OnInit, OnDestroy {

  state$: Observable<ParamsBusca> = this.activatedRoute.queryParams.pipe(
    map(qp => mapQpToParamsBusca(qp)),
    shareReplay(1)
  );

  currentState!: ParamsBusca;

  destroy$ = new Subject<void>;
  appState$ = this.tarefaStore.state$;

  filterSortForm = this.fb.group({
    concluida: new FormControl<boolean | undefined>(undefined),
    sort: new FormControl<string | null>(null)
  });

  constructor(
    private tarefaService: TarefaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tarefaStore: TarefaStore
  ) { }

  ngOnInit(): void {
    // assinamos o state logo no início para atualizar a propriedade currentState sempre que emitir
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(s => {
      this.currentState = s;
      this.carregarDados();

      let qpConcluida = s.filters?.find(f => f.propriedade == 'concluida')?.valor as string;
      let concluidaAsBoolean = this.concluidaAsBoolean(qpConcluida);

      this.filterSortForm.patchValue({
        sort: s.sort,
        concluida: concluidaAsBoolean
      }, { emitEvent: false });
    });
    // assinamos os query params da rota logo no início para recarregar tarefas sempre que emitir (inclusive no primeiro carregamento)
    //this.activatedRoute.queryParams.subscribe(() => this.carregarTarefas());

    this.filterSortForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.atualizarfilterSort());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private concluidaAsBoolean(qpConcluida: string) {
    switch (qpConcluida) {
      case 'true': return true;
      case 'false': return false;
      default: return undefined;
    }
  }

  // --- Ações de UI ---

  protected excluirConcluidas(): void {
    this.tarefaService.excluirConcluidas().subscribe({
      next: (resultado) => {
        if (resultado === null) {
          alert('Não há tarefas concluídas para excluir!');
          return;
        }
        this.carregarDados();
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
    this.carregarDados();
  }

  onConcluida() {
    this.carregarDados();
  }

  carregarDados() {
    this.tarefaStore.carregarDados(this.currentState);
  }


}
