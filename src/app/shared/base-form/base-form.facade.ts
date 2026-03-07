import { Injectable, OnDestroy } from '@angular/core';
import { delay, Subject, takeUntil } from 'rxjs';
import { BaseService } from '../base-service/base.service';
import { BaseFormStore } from './base-form.store';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export abstract class BaseFormFacade<D extends { id?: number | null }> implements OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  state$ = this.store.state$;
  private destroy$ = new Subject<void>();

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(private store: BaseFormStore<D>, private service: BaseService<D>, private toastr: ToastrService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  inicializarDados(dto: D | undefined, id: number) {
    if (!dto) dto = this.createEmpty();
    this.store.inicializarDados(dto, id);
  }

  save(formValue: any) {
    this.store.setSalvando(formValue);
    this.service.save(formValue, this.store.getId())
      // take(1) não precisa porque o HttpClient já completa automaticamente após a 1ª emissão
      // takeUntil é necessário para o caso do componente ser destruído antes da resposta chegar: o Angular tentaria atualizar uma store já destruída
      .pipe(takeUntil(this.destroy$)/*, take(1)*/, delay(2000))
      .subscribe({
        next: t => {
          this.store.atualizarDtoFromApi(t);
          this.toastr.success('Salvo com sucesso!');
        },
        error: () => {
          this.store.setErrorSalvar();
          this.toastr.error('Não foi possível salvar. Tente novamente.');
        }
      });
  }

  /**
   * Retornar nesta função o método estático de construção do DTO vazio, que por padrão fica no arquivo de model da entidade.
   */
  protected abstract createEmpty(): D;

}
