import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<BaseFormComponent<any>> {
  canDeactivate(
    component: BaseFormComponent<any>,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.hasUnsavedChanges) {
      return confirm("Tem certeza que deseja sair desta página? Seus dados do fomulário serão perdidos!");
    }
    return true;
  }

}
