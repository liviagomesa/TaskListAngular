import { Subject, takeUntil } from 'rxjs';
import { Tarefa } from '../../tarefa.types';
import { TarefaService } from './../../tarefa.service';
import { TarefaDetailsStore } from './tarefa-details.store';
import { Injectable, OnDestroy } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TarefaDetailsFacade implements OnDestroy {

  // o state é um objeto que contém as propriedades: dados, salvandoConclusao, errorSalvar, recarregando, errorRecarregar
  // (inicialização e controle de valores na store. cada alteração gera uma emissão)
  state$ = this.store.state$;
  private destroy$ = new Subject<void>();

  constructor(private store: TarefaDetailsStore, private service: TarefaService, private toastr: ToastrService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarDados(dto: Tarefa, id: number) {
    this.store.inicializarDados(dto, id);
  }

  toggleConclusao() {
    this.store.setSalvandoConclusao();
    this.service.patch({ concluida: !this.store.getDto().concluida }, this.store.getId() )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: t => this.store.atualizarDto(t),
        error: () => {
          this.store.setErrorSalvar();
          this.toastr.error('⚠️ Erro: Não foi possível conectar ao servidor para salvar. Tente novamente.');
        }
      });
  }

}
