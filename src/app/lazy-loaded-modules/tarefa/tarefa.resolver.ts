import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Tarefa } from './tarefa.model';
import { TarefaService } from './tarefa.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarefaResolver implements Resolve<Observable<Tarefa | undefined>> {
  resolve(route: ActivatedRouteSnapshot): Observable<Tarefa | undefined> {
    const id = route.params['id'];
    return this.tarefaService.getById(id).pipe(
      tap(tarefa => {
        if (!tarefa) this.router.navigate(['/not-found']);
      })
    );
  }

  constructor(private tarefaService: TarefaService, private router: Router) {}
}
