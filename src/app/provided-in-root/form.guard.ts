import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FormPage } from './form-page.model';

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<FormPage> {
  canDeactivate(
    component: FormPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.hasUnsavedChanges) {
      return confirm("Tem certeza que deseja sair desta página? Seus dados do fomulário serão perdidos!");
    }
    return true;
  }

}
