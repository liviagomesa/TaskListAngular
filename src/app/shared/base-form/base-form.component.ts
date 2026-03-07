import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BaseFormFacade } from './base-form.facade';
import { BaseFormStore } from './base-form.store';
import { BaseFormState } from './base-form.state';

@Component({
  selector: 'app-base-form',
  template: '<div></div>',
  providers: [BaseFormStore]
})
export abstract class BaseFormComponent<T extends { id?: number | null }> implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  form!: FormGroup;
  destroy$ = new Subject<void>;
  state$!: Observable<BaseFormState<T> | null>;

  get idRota(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  get hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected fb: FormBuilder,
    protected facade: BaseFormFacade<T>
  ) {
    this.state$ = facade.state$;
  }

  ngOnInit(): void {
    this.criarFormControls();
    this.atualizarStateFromRoute();
    this.reagirAoStateNoForm();
  }

  ngOnDestroy(): void {
    //this.inscricao?.unsubscribe(); // com operador elvis porque inscricao pode ser undefined (se metodo que subscreve nunca for executado)
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Este método usa o FormBuilder para criar todos os controles de `form`
   * com valores padrão (ex.: '', false ou [] no caso de FormArray).
   */
  abstract criarFormControls(): void;

  atualizarStateFromRoute(): void {
    combineLatest([this.route.paramMap, this.route.data])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([paramMap, data]) => {
      const id = Number(paramMap.get('id'));
      const dto = data['dto'] as T | undefined;
      this.facade.inicializarDados(dto, id);
    });
  }

  /** Quando este método é chamado, os controles de `form`
   * já estão criados, porém com valores padrão
   * (ex.: '', false ou [] no caso de FormArray).
   */
  reagirAoStateNoForm(): void {
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state && !state.salvando && !state.errorSalvar) {
        // limpa o estado do form (marca como não alterado)
        this.form.markAsPristine();
        // patchValue preenche apenas os controles que já existem
        // (os controles dos FormArray não existem ainda neste ponto)
        this.form.patchValue(state.dto);
        this.limparFormArrays();
        // neste método, criamos os controles dos FormArrays de form
        this.criarEPreencherFormArraysControls(state.dto);
      }
    });
  }

  private limparFormArrays(): void {
  Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control instanceof FormArray) control.clear();
    });
  }

  /**
   * Neste método, criamos os controles dos FormArrays de `form`.
   */
  protected criarEPreencherFormArraysControls(dto: T): void {
    // implementado pelas classes filhas se necessário
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      this.facade.save(this.form.value);
    } else {
      this.markFormGroupAsTouched(this.form);
    }
  }

  private markFormGroupAsTouched(formGroup: FormGroup): void {
    const listaChaves: string[] = Object.keys(formGroup.controls);
    listaChaves.forEach((chave: string) => {
      const control = formGroup.get(chave);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      } else if (control instanceof FormArray) {
        this.markFormArrayAsTouched(control);
      }
    });
  }

  private markFormArrayAsTouched(formArray: FormArray): void {
    const controls = formArray.controls;
    controls.forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      } else if (control instanceof FormArray) {
        this.markFormArrayAsTouched(control);
      }
    })
  }

  getValidationClass(path: string | (string | number)[]) {
    let control = this.form.get(path);
    return {
      //'is-valid': control?.valid && control?.touched,
      'is-invalid': control?.invalid && control?.touched
    }
  }

}
