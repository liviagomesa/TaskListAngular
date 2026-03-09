import { Component, OnInit } from '@angular/core';
import { SecurityFacade } from 'src/app/provided-in-root/security-and-guards/security.facade';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent {

  constructor(private facade: SecurityFacade) { }

  logout() {
    this.facade.logout();
  }

}
