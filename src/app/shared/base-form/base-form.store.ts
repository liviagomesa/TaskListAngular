import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseFormState } from './base-form.state';

@Injectable()
export class BaseFormStore<D extends { id?: number | null }> {

  private _state$ = new BehaviorSubject<BaseFormState<D> | null>(null);
  state$ = this._state$.asObservable();

  // GETTERS

  getId(): number {
    return this._state$.value!.id as number;
  }

  // SETTERS

  inicializarDados(dto: D, id: number) {
    this._state$.next({ dto, id, salvando: false, errorSalvar: false });
  }

  setSalvando(dto: any) {
    this._state$.next({ ...this._state$.value!, dto, salvando: true, errorSalvar: false });
  }

  atualizarDtoFromApi(dto: D) {
    this._state$.next({ ...this._state$.value!, dto, salvando: false, errorSalvar: false });
  }

  setErrorSalvar() {
    this._state$.next({ ...this._state$.value!, salvando: false, errorSalvar: true });
  }
}
