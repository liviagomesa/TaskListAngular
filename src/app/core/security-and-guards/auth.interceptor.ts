import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { SecurityFacade } from "./security.facade";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private facade: SecurityFacade, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.facade.token;

    // a API retorna o token no login e salvamos no localStorage
    // se não tem token no localStorage (caso de requisição de login, por exemplo),
    // usuário não está autenticado: prosseguimos a request sem fazer nada
    if (!token) return next.handle(req);

    // caso tenha token, clona a request, adiciona o header e envia o clone no lugar da req original
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // unauthorized (credenciais inválidas)
        if (error.status === 401) this.facade.logout();
        // forbidden
        if (error.status === 403) this.toastr.error('Acesso negado');
        return throwError(() => error);
      })
    );
  }

}
