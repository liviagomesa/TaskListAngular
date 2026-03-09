import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { SecurityFacade } from './security.facade';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate, CanLoad {

  canActivate(): boolean {
    return this.isLoggedIn();
  }

  canLoad(): boolean {
    return this.isLoggedIn();
  }

  constructor(private facade: SecurityFacade, private router: Router) {}

  private isLoggedIn(): boolean {
    if (this.facade.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;
  }

}
