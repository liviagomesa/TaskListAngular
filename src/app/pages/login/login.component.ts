import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.types';
import { SecurityFacade } from 'src/app/core/security-and-guards/security.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading$ = this.facade.loading$;

  protected usuario: Usuario = {
    email: '',
    password: ''
  };

  constructor(private facade: SecurityFacade) { }

  protected fazerLogin(): void {
    this.facade.fazerLogin(this.usuario);
  }

}
