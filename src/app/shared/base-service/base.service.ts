import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParamsBusca } from 'src/app/provided-in-root/params-busca.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<D extends { id?: number | null }> {

  readonly abstract endpoint: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  constructor(protected httpClient: HttpClient) { }

  findAll(options?: ParamsBusca): Observable<D[]> {
    let params = new HttpParams();

    if (options?.page) {
      params = params.set('_page', options.page);
    }

    params = params.set('_per_page', options?.pageSize || 5);

    if (options?.sort) {
      params = params.set('_sort', options.sort);
    }

    const filters = options?.filters;

    if (filters) {
      for (const filter of filters) { // in retorna o indice do array, of retorna o objeto do array
        params = params.set(
          filter.propriedade + (filter.condicao == "equals" ? "" : ("_" + filter.condicao)),
          filter.valor
        );
      }
    }

    return this.httpClient.get<D[]>(this.baseUrl, { params }).pipe(delay(2000));
  }

  /**
   * Cria uma entidade sem criar suas entidades filhas.
   */
  create(formValue: D): Observable<D> {
    return this.httpClient.post<D>(this.baseUrl, formValue);
  }

  /**
   * Atualiza uma entidade sem atualizar suas entidades filhas.
   */
  update(formValue: D, id: number): Observable<D> {
    return this.httpClient.put<D>(`${this.baseUrl}/${id}`, formValue);
  }

  /**
   * Deleta uma entidade sem deletar suas entidades filhas.
   */
  deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Encontra uma entidade pelo id sem as entidades filhas.
   */
  findById(id: number): Observable<D> {
    return this.httpClient.get<D>(`${this.baseUrl}/${id}`);
  }

  /**
   * Esta função é usada só quando necessário "provar" para o TS que um objeto é uma instância de E
   * A sintaxe do seu retorno significa: "retorna boolean, e, se for true, sabe-se que x é E"
   * */
  protected isDto(x: D | undefined): x is D {
    return !!x; // se obj for null/undefined, ! nega (transforma em true) e !! transforma em false
  }

  countAll(): Observable<number> {
    return this.httpClient.get<D[]>(this.baseUrl, {
      params: new HttpParams().set('_per_page', '1').set('_page', 1),
      observe: 'response'
    }).pipe(
      map(resp => Number(resp.headers.get('X-Total-Count')) || 0)
    );
  }

}
