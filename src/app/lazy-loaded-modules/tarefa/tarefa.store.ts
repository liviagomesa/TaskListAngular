import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TarefaService } from './tarefa.service';
import { TarefaState, initialTarefaState, errorTarefaState } from './tarefa.state';

@Injectable({ providedIn: 'root' })
export class TarefaStore {
  private stateSubject = new BehaviorSubject<TarefaState>(initialTarefaState);

  state$ = this.stateSubject.asObservable();

  constructor(private tarefaService: TarefaService) {}

  /**
   * Carrega Lista, Total e Concluídas em paralelo.
   * Se o servidor cair, o forkJoin falha e ativa o estado de erro global.
   */
  carregarDados(params: any) {
    this.stateSubject.next({ ...this.stateSubject.value, loading: true, error: false });

    forkJoin({
      tarefas: this.tarefaService.findAll(params),
      total: this.tarefaService.countAll(),
      concluidas: this.tarefaService.countConcluidas()
    }).pipe(
      map(res => ({
        dados: res.tarefas,
        total: Number(res.total),
        concluidas: Number(res.concluidas),
        loading: false,
        error: false
      })),
      catchError(() => of(errorTarefaState))
    ).subscribe(novoEstado => this.stateSubject.next(novoEstado));
  }
}
