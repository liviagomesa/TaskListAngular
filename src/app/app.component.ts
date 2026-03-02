import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SecurityService } from './provided-in-root/security-and-guards/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  protected usuarioLogado: boolean = false;
  private destroy$ = new Subject<void>;

  ngOnInit(): void {
    this.authService.logadoEmitter.pipe(
      takeUntil(this.destroy$)
    ).subscribe((logado: boolean) => {
      if (logado) this.usuarioLogado = true;
      else this.usuarioLogado = false;
    })
  }

  constructor(private authService: SecurityService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
