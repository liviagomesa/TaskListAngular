export class FormPage {
  campoAlterado: boolean = false;
  formFoiSalvo: boolean = false;

  get hasUnsavedChanges(): boolean {
    return this.campoAlterado && !this.formFoiSalvo;
  }
}
