import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.model';
import { SecurityService } from 'src/app/provided-in-root/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  protected usuario: Usuario = new Usuario();

  constructor(private securityService: SecurityService) { }

  ngOnInit(): void {
  }

  protected fazerLogin(): void {
    this.securityService.fazerLogin(this.usuario);
  }

}
