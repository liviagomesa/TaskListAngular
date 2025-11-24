import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private usuarioAutenticado: boolean = false;
  public logadoEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router) { }

  public fazerLogin(usuario: Usuario): void {
    if (usuario.email == 'usuario@email.com' && usuario.senha == '123456') {
      this.usuarioAutenticado = true;
      this.router.navigate(['/']);
    } else {
      this.usuarioAutenticado = false;
      alert('Credenciais inválidas');
    }
    this.logadoEmitter.emit(this.usuarioAutenticado);
  }

  public isUsuarioAutenticado(): boolean {
    return this.usuarioAutenticado;
  }
}
