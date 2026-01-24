import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FiltroTarefas } from '../../enums/filtro-tarefas.enum';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.scss']
})
export class ListaTarefasComponent implements OnInit, OnDestroy {

  filtroAplicado: FiltroTarefas = FiltroTarefas.Todas; // "Todas" ou "Pendentes" ou "Concluídas"
  filtros = Object.values(FiltroTarefas); // [ "Todas", "Pendentes", "Concluídas" ]
  ordemAplicada: string = '';
  pagina!: number;
  inscricao!: Subscription;
  // valores serão atribuidos no ngOnInit
  tarefas$!: Observable<Tarefa[]>;
  totalTarefas$!: Observable<number>;
  quantConcluidas$!: Observable<number>;

  constructor(private tarefaService: TarefaService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

  ngOnInit(): void {
    // inicializando observables
    this.tarefas$ = this.tarefaService.getTarefas(this.filtroAplicado, this.ordemAplicada);
    this.totalTarefas$ = this.tarefas$.pipe(
      map((response: Tarefa[]) => response.length)
    );
    this.quantConcluidas$ = this.tarefas$.pipe(
      map((response: Tarefa[]) => response.filter(t => t.concluida).length)
    );

    this.inscricao = this.activatedRoute.queryParams.subscribe((params: any) => {
      const parametroPagina: number = params['pagina'];
      if (!parametroPagina) {
        this.pagina = 1;
        this.router.navigate(['/tarefas'], { queryParams: { 'pagina': this.pagina } });
      } else {
        this.pagina = parametroPagina;
      }
    });
  }

  protected excluirConcluidas(): void {
    this.tarefaService.excluirConcluidas();
  }

  protected proximaPagina() {
    this.pagina++;
    this.router.navigate(['/tarefas'], { queryParams: { 'pagina': this.pagina } });
  }

}
