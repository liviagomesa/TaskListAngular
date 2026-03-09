import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private loginUrl = `${environment.apiUrl}/login`;
  private registerUrl = `${environment.apiUrl}/register`;

  constructor(private http: HttpClient) { }

  public login(formValue: Partial<Usuario>): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(this.loginUrl, formValue);
  }

  public registrar(formValue: Usuario): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(this.registerUrl, formValue);
  }

}
