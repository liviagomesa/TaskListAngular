import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioDetailsComponent } from './pages/usuario-details/usuario-details.component';
import { PreferenciasDetailsComponent } from './pages/preferencias-details/preferencias-details.component';


@NgModule({
  declarations: [
    UsuarioDetailsComponent,
    PreferenciasDetailsComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
