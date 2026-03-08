import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private usuarioAutenticado: boolean = false;
  public logadoEmitter: Subject<boolean> = new Subject();

  constructor(private router: Router) { }

  public fazerLogin(usuario: Usuario): void {
    if (usuario.email == 'usuario@email.com' && usuario.senha == '123456') {
      this.usuarioAutenticado = true;
      this.router.navigate(['/']);
    } else {
      this.usuarioAutenticado = false;
      alert('Credenciais inválidas');
    }
    this.logadoEmitter.next(this.usuarioAutenticado);
  }

  public isUsuarioAutenticado(): boolean {
    return this.usuarioAutenticado;
  }
}
