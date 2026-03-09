import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { Usuario } from './usuario.types';
import { BaseService } from 'src/app/shared/base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario> {

  override endpoint: string = 'users';

  /**
   * Método utilizado pela validação assíncrona de cadastro de e-mail:
   * disparado assim que a validação síncrona passar e o campo perder foco.
   */
  isEmailCadastrado(email: string): Observable<boolean> {
    // TODO: Filtrar no backend (quando tiver o backend real)
    return this.findAll().pipe(
      map (res => res.some(u => u.email === email))
    )
  }
}
