import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Tarefa } from './tarefa.model';
import { TarefaService } from './tarefa.service';

@Injectable({
  providedIn: 'root'
})
export class TarefaResolver implements Resolve<Tarefa | undefined> {
  resolve(route: ActivatedRouteSnapshot): Tarefa | undefined {
    const id = route.params['id'];
    const tarefa: Tarefa | undefined = this.tarefaService.getById(id);
    if (tarefa == undefined) {
      this.router.navigate(['/not-found']);
    }
    return tarefa;
  }

  constructor(private tarefaService: TarefaService, private router: Router) {}
}
