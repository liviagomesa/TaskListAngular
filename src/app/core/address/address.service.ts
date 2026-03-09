import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, shareReplay } from 'rxjs';
import { Cidade, Estado, ViaCepResponse } from './address.types';

export { ViaCepResponse } from './address.types';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  private readonly estados$ = this.http.get<Estado[]>('assets/estados.json').pipe(shareReplay(1));
  private readonly cidades$ = this.http.get<Cidade[]>('assets/Cidades.json').pipe(shareReplay(1));

  constructor(private http: HttpClient) { }

  buscarPorCep(cep: string): Observable<ViaCepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.viaCepUrl}/${cepLimpo}/json/`)
      .pipe(delay(2000));
  }

  getEstados(): Observable<Estado[]> {
    return this.estados$;
  }

  getCidadesByEstado(estadoId: number): Observable<Cidade[]> {
    return this.cidades$.pipe(
      map(cidades => cidades.filter(c => Number(c.Estado) === estadoId))
    );
  }

}
