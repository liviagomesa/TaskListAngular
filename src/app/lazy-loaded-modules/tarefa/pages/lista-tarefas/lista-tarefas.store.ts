import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListaTarefasState, initialListaTarefasState } from './lista-tarefas.state';
import { Tarefa } from '../../tarefa.model';

@Injectable()
export class ListaTarefasStore {

  // O "cofre" — guarda e protege o estado atual da tela de listagem e o expõe para o template via state$
  private _state$ = new BehaviorSubject<ListaTarefasState>(initialListaTarefasState);
  state$ = this._state$.asObservable();

  // GETTERS (SÓ SE PRECISAR NA FACADE)

  getPage(): number {
    return this._state$.value.page;
  }

  getSort(): string | null {
    return this._state$.value.sort;
  }

  getFiltrarConcluidas(): boolean | undefined {
    return this._state$.value.filtrarConcluidas;
  }

  // SETTERS

  atualizarDadosFiltragem(sort: string | null, page: number, filtrarConcluidas: boolean | undefined) {
    this._state$.next({ ...this._state$.value, sort, page, filtrarConcluidas });
  }

  atualizarDadosServidor(lista: Tarefa[], total: number, concluidas: number) {
    this._state$.next({
      ...this._state$.value, // sort, page e filtrarConcluidas permanecem
      lista, total, concluidas,
      loadingDados: false, errorDados: false,
      excluindoConcluidas: false, errorExcluirConcluidas: false,
      salvandoConclusao: false, errorSalvarConclusao: false,
      excluindoTarefa: false, errorExcluirTarefa: false
    });
  }

  setExcluindoConcluidas() {
    this._state$.next({ ...this._state$.value, excluindoConcluidas: true, errorExcluirConcluidas: false });
  }

  setErrorExcluirConcluidas() {
    this._state$.next({ ...this._state$.value, excluindoConcluidas: false, errorExcluirConcluidas: true });
  }

  setSalvandoConclusao() {
    this._state$.next({ ...this._state$.value!, salvandoConclusao: true, errorSalvarConclusao: false });
  }

  setErrorSalvarConclusao() {
    this._state$.next({ ...this._state$.value!, salvandoConclusao: false, errorSalvarConclusao: true });
  }

  setExcluindoTarefa() {
    this._state$.next({ ...this._state$.value!, excluindoTarefa: true, errorExcluirTarefa: false });
  }

  setErrorExcluirTarefa() {
    this._state$.next({ ...this._state$.value!, excluindoTarefa: false, errorExcluirTarefa: true });
  }

  setLoadingDados() {
    this._state$.next({ ...this._state$.value, loadingDados: true, errorDados: false });
  }

  setErrorDados() {
    this._state$.next({ ...this._state$.value, loadingDados: false, errorDados: true });
  }

}
