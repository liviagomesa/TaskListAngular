import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Tarefa } from './tarefa.types';
import { TarefaService } from './tarefa.service';
import { catchError, EMPTY, filter, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarefaResolver implements Resolve<Tarefa> {

  // ao abrir o componente, o Angular executa o resolver, se inscreve no Observable,
  // espera completar e só então coloca o resultado final (a Tarefa) em activatedRoute.data
  resolve(route: ActivatedRouteSnapshot): Observable<Tarefa> {
    const id = Number(route.paramMap.get('id'));
    return this.tarefaService.findByIdWithEmbed(id).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    );
  }

  constructor(private tarefaService: TarefaService, private router: Router) {}

}
