import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiasDesdePipe } from './dias-desde.pipe';



@NgModule({
  declarations: [
    DiasDesdePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DiasDesdePipe
  ]
})
export class SharedModule { }
