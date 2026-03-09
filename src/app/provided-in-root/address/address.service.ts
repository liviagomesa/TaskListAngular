import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, shareReplay } from 'rxjs';
import { Cidade, Estado } from 'src/app/lazy-loaded-modules/usuario/usuario.types';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

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
