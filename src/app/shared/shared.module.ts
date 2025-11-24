import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiasDesdePipe } from './dias-desde.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { InputFieldComponent } from './input-field/input-field.component';
import { BaseFormComponent } from './base-form/base-form.component';
import { CamelCasePipe } from './camel-case.pipe';
import { ErrorMsgComponent } from './error-msg/error-msg.component';



@NgModule({
  declarations: [
    DiasDesdePipe,
    SlugifyPipe,
    InputFieldComponent,
    CamelCasePipe,
    ErrorMsgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DiasDesdePipe,
    SlugifyPipe
  ]
})
export class SharedModule { }
