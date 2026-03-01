import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { BaseService } from '../base-service/base.service';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent<T extends { id?: number | null }> implements OnInit, OnDestroy {

  form!: FormGroup;
  inscricao!: Subscription;
  dto!: T; // vem do resolver
  protected service!: BaseService<T>;
  protected idRota!: number | null;

  get hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idRota = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.criarFormControls();
    console.log(this.form);
    this.setDtoAndFormValueFromRoute();
    /*this.form.valueChanges.subscribe((val) => {
      this.form.markAsDirty();
    });*/
  }

  ngOnDestroy(): void {
    this.inscricao?.unsubscribe(); // com operador elvis porque inscricao pode ser undefined (se metodo que subscreve nunca for executado)
  }

  /** Este método usa o FormBuilder para criar todos os controles de `form`
   * com valores padrão (ex.: '', false ou [] no caso de FormArray).
   */
  abstract criarFormControls(): void;

  onSubmit() {
    console.log(this.form);

    if (this.form.valid) {
      this.service.save(this.form.value, this.idRota).subscribe({
        next: () => {
          this.form.markAsPristine();
          alert('Formulário enviado com sucesso!');
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        },
        error: () => alert('Erro ao salvar')
      });
    } else {
      this.markFormGroupAsTouched(this.form);
    }
  }

  setService(service: any) { // necessário chamar no construtor de todas as classes filhas!!
    this.service = service;
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

  /** Quando este método é chamado, os controles de `form`
   * já estão criados, porém com valores padrão
   * (ex.: '', false ou [] no caso de FormArray).
   */
  setDtoAndFormValueFromRoute(): void {
    // activatedRoute.data sempre emite quando a rota é aberta, em qualquer rota!
    // mas não necessariamente existe o campo dto (caso de rota /new)
    this.inscricao = this.activatedRoute.data.subscribe((objetoEmitidoRota: any) => {
      const dto = objetoEmitidoRota['dto'] as T | undefined;
      this.dto = dto ?? this.service.createEmpty();
      // patchValue preenche apenas os controles que já existem
      // (os controles dos FormArray não existem ainda neste ponto)
      this.form.patchValue(this.dto);
      // neste método, criamos os controles dos FormArrays de form
      this.criarEPreencherFormArraysControls();
    })
  }

  /**
   * Neste método, criamos os controles dos FormArrays de `form`.
   */
  protected criarEPreencherFormArraysControls(): void {
    // implementado pelas classes filhas se necessário
  }

}
