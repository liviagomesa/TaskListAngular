import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiasDesdePipe } from './dias-desde.pipe';
import { SlugifyPipe } from './slugify.pipe';



@NgModule({
  declarations: [
    DiasDesdePipe,
    SlugifyPipe
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
