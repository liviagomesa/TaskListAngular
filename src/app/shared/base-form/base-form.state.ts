export interface BaseFormState<D extends { id?: number | null }> {
  dto: D;
  id: number;
  salvando: boolean;
  errorSalvar: boolean;
}
