import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { Usuario } from './usuario.types';
import { UsuarioService } from './usuario.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { SecurityFacade } from 'src/app/core/security-and-guards/security.facade';

@Injectable({
  providedIn: 'root'
})
export class UsuarioResolver implements Resolve<Usuario> {

  // ao abrir o componente, o Angular executa o resolver, se inscreve no Observable,
  // espera completar e só então coloca o resultado final (o Usuario) em activatedRoute.data
  resolve(): Observable<Usuario> {
    const id = this.securityFacade.userId as number;
    return this.service.findById(id).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    );
  }

  constructor(private service: UsuarioService, private router: Router, private securityFacade: SecurityFacade) {}

}
