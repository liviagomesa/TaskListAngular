import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Tarefa } from '../../tarefa.types';
import { FormBuilder, FormControl } from '@angular/forms';
import { ListaTarefasFacade } from './lista-tarefas.facade';
import { ListaTarefasStore } from './lista-tarefas.store';

@Component({
  selector: 'app-lista-tarefas',
  templateUrl: './lista-tarefas.component.html',
  styleUrls: ['./lista-tarefas.component.scss'],
  providers: [ListaTarefasFacade, ListaTarefasStore]
  // Por que declarar Store e Facade em providers se o componente só injeta a Facade?

  // Porque o Angular precisa saber onde criar a Store — e ela precisa ter o mesmo escopo do componente.
  // Se você não declarar em providers, o Angular vai procurar ela nos escopos acima e não vai encontrar
  // (já que não tem providedIn).
})
export class ListaTarefasComponent implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  private destroy$ = new Subject<void>();
  state$ = this.facade.state$;

  filterSortForm = this.fb.group({
    concluida: new FormControl<boolean | undefined>(undefined),
    sort: new FormControl<string | null>(null)
  });

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private facade: ListaTarefasFacade
  ) { }

  // Fluxo:
  // Primeiro disparador: usuario mexe no form
  // Sequência de atualizações: rota → state → template (inclusive values form)
  // Se usuário entra direto na rota, continua válido (o fluxo só começa de um ponto diferente)
  // NÃO gera loop porque o Angular não dispara valueChanges em setValue se o valor não mudou
  ngOnInit(): void {
    this.atualizarStateFromRoute();
    this.reagirAoStateNoForm();
    this.setRouteFromForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  atualizarStateFromRoute(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(queryParamMap => {
        const sort = queryParamMap.get('sort');
        const page = Number(queryParamMap.get('page')) || 1;
        const concluida = this.concluidaAsBoolean(queryParamMap.get('concluida'));
        this.facade.atualizarDadosFiltragem(sort, page, concluida);
      });
  }

  /**
   * campos de formulário de qualquer tipo eu não consigo puxar do state$ direto no template
   * (como a página, que é um texto normal, ou a lista de tarefas filtrada),
   * mas consigo usar setValue no ts
   */
  reagirAoStateNoForm(): void {
    this.state$.pipe(
      // Só deixa passar se sort OU filtrarConcluidas mudaram de fato
      distinctUntilChanged((prev, curr) =>
        prev.sort === curr.sort &&
        prev.filtrarConcluidas === curr.filtrarConcluidas
      ),
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.filterSortForm.get('sort')?.setValue(state.sort);
      this.filterSortForm.get('concluida')?.setValue(state.filtrarConcluidas);
    });
  }

  setRouteFromForm(): void {
    this.filterSortForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.router.navigate([], {
        queryParamsHandling: 'merge', // Mantém os outros parâmetros já existentes
        queryParams: {
          concluida: this.filterSortForm.get('concluida')?.value, // Se for undefined, o Angular remove o param
          sort: this.filterSortForm.get('sort')?.value,
          page: 1
        }
      });
    });
  }

  private concluidaAsBoolean(concluidaAsString: string | null) {
    switch (concluidaAsString) {
      case 'true': return true;
      case 'false': return false;
      default: return undefined;
    }
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  excluirConcluidas(): void {
    this.facade.excluirConcluidas();
  }

  toggleConclusao(tarefa: Tarefa) {
    this.facade.toggleConclusao(tarefa);
  }

  deleteById(id: number) {
    this.facade.deleteById(id);
  }

  incrementarPagina(valorASomar: number) {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        page: Number(this.route.snapshot.queryParamMap.get('page')) + valorASomar
      }
    });
  }

}
