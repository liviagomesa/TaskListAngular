import { Component } from '@angular/core';
import { SecurityFacade } from './core/security-and-guards/security.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(protected facade: SecurityFacade) {}

}
