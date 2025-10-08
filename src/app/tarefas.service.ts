import { Injectable } from '@angular/core';
import { Tarefa } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  constructor() { }

  getAllTarefas(): Tarefa[] {
    return [
      {
        titulo: 'Limpar quintal',
        isConcluida: false
      },
      {
        titulo: 'Ir ao médico',
        isConcluida: true
      }
    ];
  }

}
