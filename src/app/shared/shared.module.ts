import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiasDesdePipe } from './dias-desde.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { InputFieldComponent } from './input-field/input-field.component';
import { CamelCasePipe } from './camel-case.pipe';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from "ngx-mask";
import { AlertComponent } from './alert/alert/alert.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    DiasDesdePipe,
    SlugifyPipe,
    InputFieldComponent,
    CamelCasePipe,
    ErrorMsgComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    NgbAlertModule
  ],
  exports: [
    DiasDesdePipe,
    SlugifyPipe,
    InputFieldComponent,
    CamelCasePipe,
    ErrorMsgComponent,
    AlertComponent
  ]
})
export class SharedModule { }
