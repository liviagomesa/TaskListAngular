import { forkJoin, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ParamsBusca } from 'src/app/provided-in-root/params-busca.model';
import { ListaTarefasStore } from './lista-tarefas.store';
import { Injectable, OnDestroy } from "@angular/core";
import { TarefaService } from '../../tarefa.service';
import { Tarefa } from '../../tarefa.model';

@Injectable() // sem providedIn
export class ListaTarefasFacade implements OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  state$ = this.store.state$;
  private destroy$ = new Subject<void>();

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(private store: ListaTarefasStore, private service: TarefaService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  atualizarDadosFiltragem(sort: string | null, page: number, filtrarConcluidas: boolean | undefined) {
    this.store.atualizarDadosFiltragem(sort, page, filtrarConcluidas);
    this.findDadosServidor().subscribe({
      next: dadosServidor => this.store.atualizarDadosServidor(dadosServidor.tarefas, dadosServidor.total, dadosServidor.concluidas),
      error: () => this.store.setErrorDados()
    });
  }

  private findDadosServidor(): Observable<{ tarefas: Tarefa[], total: number, concluidas: number }> {
    this.store.setLoadingDados();
    return forkJoin({
      tarefas: this.service.findAll(this.getParamsBuscaFromState()),
      total: this.service.countAll(),
      concluidas: this.service.countConcluidas()
    }).pipe(takeUntil(this.destroy$));
  }

  private getParamsBuscaFromState(): ParamsBusca {
    let paramsBusca: ParamsBusca = { page: this.store.getPage() };
    if (this.store.getSort() !== null) paramsBusca.sort = this.store.getSort()!;
    if (this.store.getFiltrarConcluidas() !== undefined) paramsBusca.filters = [{
      propriedade: 'concluida',
      condicao: 'equals',
      valor: this.store.getFiltrarConcluidas()!
    }];
    return paramsBusca;
  }

  excluirConcluidas() {
    this.store.setExcluindoConcluidas();
    this.service.excluirConcluidas()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.findDadosServidor())
      ).subscribe({
        next: dadosServidor => this.store.atualizarDadosServidor(dadosServidor.tarefas, dadosServidor.total, dadosServidor.concluidas),
        error: () => {
          this.store.setErrorExcluirConcluidas();
          this.store.setErrorDados();
        }
      });
  }

  toggleConclusao(id: number) {
    this.store.setSalvandoConclusao();
    this.service.toggleConclusaoById(id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.findDadosServidor())
      ).subscribe({
        next: dadosServidor => this.store.atualizarDadosServidor(dadosServidor.tarefas, dadosServidor.total, dadosServidor.concluidas),
        error: () => {
          this.store.setErrorSalvarConclusao();
          this.store.setErrorDados();
        }
      });
  }

  deleteById(id: number) {
    this.store.setExcluindoTarefa();
    this.service.deleteById(id)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.findDadosServidor())
      ).subscribe({
        next: dadosServidor => this.store.atualizarDadosServidor(dadosServidor.tarefas, dadosServidor.total, dadosServidor.concluidas),
        error: () => {
          this.store.setErrorExcluirTarefa();
          this.store.setErrorDados();
        }
      });
  }

}
