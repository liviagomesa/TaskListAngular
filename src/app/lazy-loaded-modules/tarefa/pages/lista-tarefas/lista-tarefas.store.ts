import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListaTarefasState, initialListaTarefasState } from './lista-tarefas.state';
import { Tarefa } from '../../tarefa.model';

@Injectable()
export class ListaTarefasStore {

  // O "cofre" — guarda e protege o estado atual da tela de listagem e o expõe para o template via state$
  private _state$ = new BehaviorSubject<ListaTarefasState>(initialListaTarefasState);
  state$ = this._state$.asObservable();

  setLoading() {
    this._state$.next({ ...this._state$.value, loading: true, error: false });
  }

  setError() {
    this._state$.next({ ...this._state$.value, loading: false, error: true });
  }

  setDados(dados: Tarefa[], total: number, concluidas: number) {
    this._state$.next({ ...this._state$.value, dados, total, concluidas, loading: false });
  }
}
