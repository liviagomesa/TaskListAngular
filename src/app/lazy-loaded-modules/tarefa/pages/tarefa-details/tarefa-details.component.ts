import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { TarefaDetailsFacade } from './tarefa-details.facade';
import { TarefaDetailsStore } from './tarefa-details.store';

@Component({
  selector: 'app-tarefa-details',
  templateUrl: './tarefa-details.component.html',
  styleUrls: ['./tarefa-details.component.scss'],
  providers: [TarefaDetailsFacade, TarefaDetailsStore]
})
export class TarefaDetailsComponent implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  state$ = this.facade.state$;
  private destroy$ = new Subject<void>();

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(private facade: TarefaDetailsFacade, private route: ActivatedRoute) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    /**
     * Uma alternativa mais simples seria usar route.snapshot.paramMap e route.snapshot.data,
     * que capturam o valor da rota no momento da chamada, isto é, no momento da criação do componente
     * (já que estamos no ngOnInit), sem necessidade de subscribe.
     *
     * Porém, se o usuário navegar de /tarefas/1 para /tarefas/2, por exemplo, o Angular não destroi
     * e recria o componente: a função ngOnInit não é re-executada.
     * Por isso, usamos route.paramMap e route.data como Observables (via subscribe),
     * para que o atributo que guarda o parâmetro da rota seja dinâmico.
     *
     * Optamos por não usar snapshot aqui pois seria redundante: route.paramMap e route.data já emitem
     * imediatamente com o valor atual na primeira inscrição, cobrindo o mesmo caso que o snapshot cobriria.
     *
     * combineLatest([obs1, obs2]) combina dois (ou mais) Observables e emite um array com os valores mais recentes
     * de cada um, mas SOMENTE após todos terem emitido pelo menos uma vez.
     * A cada nova emissão de qualquer um dos Observables, ele re-emite com o valor atualizado daquele
     * e o último valor conhecido do outro. Isso garante que sempre temos id e dto sincronizados ao inicializar.
     */
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([paramMap, data]) => {
        const id = Number(paramMap.get('id'));
        const tarefa = data['dto'];
        this.facade.inicializarDados(tarefa, id);
      });
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  toggleConclusao() {
    this.facade.toggleConclusao();
  }

}
