import { Injectable } from '@angular/core';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, map } from 'rxjs';
import { UsuarioService } from '../lazy-loaded-modules/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidators {

  constructor(private usuarioService: UsuarioService) { }

  emailUnico(): AsyncValidatorFn {
    return (formControl: AbstractControl): Observable<ValidationErrors | null> => {
      const valorCampo = formControl.value;
      if (valorCampo == null || valorCampo === '') return of(null);

      // avalia se o tipo é válido antes
      const tipoRecebido = typeof valorCampo;
      if (valorCampo != null && tipoRecebido != 'string') return of({ tipoInvalido: {
        expected: 'string',
        received: tipoRecebido
      } });

      return this.usuarioService.isEmailCadastrado(valorCampo).pipe(
        map(isCadastrado => {
          return isCadastrado ? { emailEmUso: { received: valorCampo } } : null
        })
      );
    }
  }

}
