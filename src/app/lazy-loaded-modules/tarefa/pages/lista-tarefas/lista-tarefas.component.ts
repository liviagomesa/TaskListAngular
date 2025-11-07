import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FiltroTarefas } from '../../enums/filtro-tarefas.enum';
import { Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { Subscription } from 'rxjs';

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

  get totalTarefas(): number {
    return this.tarefas.length;
  }

  get quantConcluidas(): number {
    return this.tarefas.filter(t => t.isConcluida).length;
  }

  get tarefas(): Tarefa[] {
    return this._tarefaService.obterTarefas(this.filtroAplicado, this.ordemAplicada);
  }

  constructor(private _tarefaService: TarefaService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

  ngOnInit(): void {
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
    this._tarefaService.excluirConcluidas();
  }

  protected proximaPagina() {
    this.pagina++;
    this.router.navigate(['/tarefas'], { queryParams: { 'pagina': this.pagina } });
  }

}
