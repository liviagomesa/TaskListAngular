import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SecurityService } from './provided-in-root/security-and-guards/security.service';
import { SecurityFacade } from './provided-in-root/security-and-guards/security.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(protected facade: SecurityFacade) {}

}
