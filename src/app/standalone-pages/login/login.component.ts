import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.model';
import { SecurityFacade } from 'src/app/provided-in-root/security-and-guards/security.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading$ = this.facade.loading$;

  protected usuario: Usuario = new Usuario();

  constructor(private facade: SecurityFacade) { }

  protected fazerLogin(): void {
    this.facade.fazerLogin(this.usuario);
  }

}
