import { catchError, EMPTY, forkJoin, Subject, switchMap } from 'rxjs';
import { ParamsBusca } from 'src/app/provided-in-root/params-busca.model';
import { ListaTarefasStore } from './lista-tarefas.store';
import { Injectable } from "@angular/core";
import { TarefaService } from '../../tarefa.service';

@Injectable() // sem providedIn
export class ListaTarefasFacade {

  state$ = this.store.state$;

  // Recebe pedidos de carregamento vindos de fora
  private requisicao$ = new Subject<ParamsBusca>();

  // Fluxo:
  // Componente → requisicao$ → [lógica interna] → state$ → template
  //                entrada                        saída

  constructor(private store: ListaTarefasStore, private service: TarefaService) {
    // "sempre que alguém colocar algo na caixa de entrada, processa e joga o resultado no estado."
    this.requisicao$.pipe(
      switchMap(paramsBusca => { // recebe cada emissão do requisicao$ e troca por um novo Observable: o forkJoin com as requisições HTTP
        this.store.setLoading();
        return forkJoin({
          tarefas: this.service.findAll(paramsBusca),
          total: this.service.countAll(),
          concluidas: this.service.countConcluidas()
        }).pipe(
          catchError(() => {
            this.store.setError();
            return EMPTY;
          })
        );
      })
    ).subscribe(res => {
      this.store.setDados(res.tarefas, Number(res.total), Number(res.concluidas));
    });
  }

  /**
   * Sempre que a rota mudar OU reload for solicitado, componente reage chamando este método, que apenas emite requisicao$
   */
  carregarDados(params: ParamsBusca) {
    this.requisicao$.next(params);
  }

  excluirConcluidas() {
    return this.service.excluirConcluidas(); // componente subscreve o retorno
  }

  setError() {
    this.store.setError();
  }

}
