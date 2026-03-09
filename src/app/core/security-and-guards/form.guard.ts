import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<BaseFormComponent<any>> {
  canDeactivate(component: BaseFormComponent<any>): boolean {
    if (component.hasUnsavedChanges) {
      return confirm("Tem certeza que deseja sair desta página? Seus dados do fomulário serão perdidos!");
    }
    return true;
  }

}
