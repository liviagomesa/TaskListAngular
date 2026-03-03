import { ParamsBusca } from '../../../../provided-in-root/params-busca.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, merge, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { mapQpToParamsBusca } from '../../tarefa.mapper';
import { ListaTarefasFacade } from './lista-tarefas.facade';
import { ListaTarefasStore } from './lista-tarefas.store';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.scss'],
  providers: [ListaTarefasFacade, ListaTarefasStore]
  // Por que declarar Store e Facade em providers se o componente só injeta a Facade?

  // Porque o Angular precisa saber onde criar a Store — e ela precisa ter o mesmo escopo do componente.
  // Se você não declarar em providers, o Angular vai procurar ela nos escopos acima e não vai encontrar
  // (já que não tem providedIn).
})
export class ListaTarefasComponent implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  private routeState$: Observable<ParamsBusca> = this.activatedRoute.queryParams.pipe(
    map(qp => mapQpToParamsBusca(qp)),
    shareReplay(1)
  );
  private reload$ = new Subject<void>();

  protected currentRouteState!: ParamsBusca;
  destroy$ = new Subject<void>();
  apiState$ = this.facade.state$;

  filterSortForm = this.fb.group({
    concluida: new FormControl<boolean | undefined>(undefined),
    sort: new FormControl<string | null>(null)
  });

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private facade: ListaTarefasFacade
  ) { }

  /**
   * Fluxo completo:
   *
   * Usuário muda filtro
    → formulário emite valueChanges
    → atualizarFilterSort() navega e muda a URL
    → routeState$ emite
    → merge emite
    → carregarDados() é chamado
   */
  ngOnInit(): void {
    // Responsabilidade 1: manter currentState e o formulário sincronizados com a URL
    this.routeState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(s => {
      this.currentRouteState = s;

      this.filterSortForm.patchValue({
        sort: s.sort,
        concluida: this.concluidaAsBoolean(
          s.filters?.find(f => f.propriedade === 'concluida')?.valor as string
        )
      }, { emitEvent: false });
    });

    // Responsabilidade 2: carregar dados sempre que a rota mudar OU reload for solicitado
    merge( // cria um observable que emite sempre que A ou B emitir
      this.routeState$,
      // reload$ é um Subject<void> → transformamos o sinal vazio no último estado conhecido da rota
      this.reload$.pipe(map(() => this.currentRouteState))
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(routeState => this.facade.carregarDados(routeState));

    // Responsabilidade 3: mudanças no formulário atualizam a URL
    this.filterSortForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.atualizarFilterSort());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  private concluidaAsBoolean(qpConcluida: string) {
    switch (qpConcluida) {
      case 'true': return true;
      case 'false': return false;
      default: return undefined;
    }
  }

  protected excluirConcluidas(): void {
    this.facade.excluirConcluidas().subscribe({
      next: (resultado) => {
        if (resultado === null) {
          alert('Não há tarefas concluídas para excluir!');
          return;
        }
        this.reload$.next();
        alert('Tarefas excluídas com sucesso!');
      },
      error: () => this.facade.setError()
    });
  }

  proximaPagina() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        page: (this.currentRouteState.page ?? 1) + 1
      }
    });
  }

  atualizarFilterSort() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        concluida: this.filterSortForm.get('concluida')?.value, // Se for undefined, o Angular remove o param
        sort: this.filterSortForm.get('sort')?.value,
        page: 1
      }
    });
  }

  onTarefaAtualizada() {
    this.reload$.next();
  }

  /** Método para o botão "Tentar novamente" do template. */
  carregarDados() {
    this.reload$.next();
  }

}
