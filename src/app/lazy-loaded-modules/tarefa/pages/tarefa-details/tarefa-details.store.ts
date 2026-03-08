import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TarefaDetailsState } from './tarefa-details.state';
import { Tarefa } from '../../tarefa.types';

@Injectable()
export class TarefaDetailsStore {

  private _state$ = new BehaviorSubject<TarefaDetailsState | null>(null);
  state$ = this._state$.asObservable();

  // GETTERS

  getId(): number {
    return this._state$.value!.id as number;
  }

  // SETTERS

  inicializarDados(dto: Tarefa, id: number) {
    this._state$.next({ dto, id, salvandoConclusao: false, errorSalvar: false });
  }

  setSalvandoConclusao() {
    this._state$.next({ ...this._state$.value!, salvandoConclusao: true, errorSalvar: false });
  }

  atualizarDto(dto: Tarefa) {
    this._state$.next({ ...this._state$.value!, dto, salvandoConclusao: false, errorSalvar: false });
  }

  setErrorSalvar() {
    this._state$.next({ ...this._state$.value!, salvandoConclusao: false, errorSalvar: true });
  }

}
