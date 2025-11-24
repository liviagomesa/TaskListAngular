import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SecurityService } from './provided-in-root/security-and-guards/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  protected usuarioLogado: boolean = false;
  private inscricao!: Subscription;

  ngOnInit(): void {
    this.inscricao = this.authService.logadoEmitter.subscribe((logado: boolean) => {
      if (logado) this.usuarioLogado = true;
      else this.usuarioLogado = false;
    })
  }

  constructor(private authService: SecurityService) {}

  ngOnDestroy(): void {
    this.inscricao.unsubscribe();
  }

}
