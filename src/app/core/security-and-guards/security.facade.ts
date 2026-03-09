import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from './security.service';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.types';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityFacade {

  loading$ = new BehaviorSubject<boolean>(false);
  private TOKEN_KEY = 'token';

  get token(): string | null { return localStorage.getItem(this.TOKEN_KEY); }

  // token: xxxxx.yyyyy.zzzzz (header.payload.signature)
  private get tokenPayload() {
    const token = this.token;
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }

  constructor(
    private service: SecurityService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  registrar(formValue: Usuario) {
    this.loading$.next(true);
    this.service.registrar(formValue)
      .subscribe({
        next: res => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          this.loading$.next(false);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Erro na solicitação de registro ao servidor: ' + err.message);
          this.loading$.next(false);
        }
      });
  }

  fazerLogin(formValue: Usuario) {
    this.loading$.next(true);
    this.service.fazerLogin(formValue)
      .subscribe({
        next: res => {
          localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          this.loading$.next(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastr.error('Credenciais inválidas');
          this.loading$.next(false);
        }
      });
  }

  public isLoggedIn(): boolean {
    const token = this.token;
    if (!token || this.isTokenExpired()) return false;
    return true;
  }

  private isTokenExpired(): boolean {
    const payload = this.tokenPayload;
    if (!payload?.exp) return true;

    return Date.now() >= payload.exp * 1000;
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

}
