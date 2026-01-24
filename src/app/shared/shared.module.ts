import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiasDesdePipe } from './dias-desde.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { InputFieldComponent } from './input-field/input-field.component';
import { CamelCasePipe } from './camel-case.pipe';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from "ngx-mask";


@NgModule({
  declarations: [
    DiasDesdePipe,
    SlugifyPipe,
    InputFieldComponent,
    CamelCasePipe,
    ErrorMsgComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    FormsModule
  ],
  exports: [
    DiasDesdePipe,
    SlugifyPipe,
    InputFieldComponent,
    CamelCasePipe,
    ErrorMsgComponent
  ]
})
export class SharedModule { }
