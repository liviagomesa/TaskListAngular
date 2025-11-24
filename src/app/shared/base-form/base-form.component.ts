import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario!: FormGroup;
  campoAlterado: boolean = false; // TODO: Ajustar essa lógica para dirty (Reactive forms)
  formFoiSalvo: boolean = false;

  get hasUnsavedChanges(): boolean { // TODO: Ajustar essa lógica para dirty (Reactive forms)
    return this.campoAlterado && !this.formFoiSalvo;
  }

  constructor(protected router: Router, protected activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.formulario);

    if (this.formulario.valid) {
      this.submit();
      this.formFoiSalvo = true; // TODO: Ajustar essa lógica para dirty (Reactive forms)
      alert('Formulário enviado com sucesso!');
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    } else {
      this.markAllAsTouched(this.formulario);
    }
  }

  abstract submit(): void;

  private markAllAsTouched(formGroup: FormGroup): void {
    const listaChaves: string[] = Object.keys(formGroup.controls);
    listaChaves.forEach((chave: string) => {
      const control = formGroup.get(chave);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  getValidationClass(controlName: string) {
    let control = this.formulario.get(controlName);
    return {
      'is-valid': control?.valid && control?.touched,
      'is-invalid': control?.invalid && control?.touched
    }
  }

}
