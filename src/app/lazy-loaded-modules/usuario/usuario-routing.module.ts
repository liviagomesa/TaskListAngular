import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioDetailsComponent } from './pages/usuario-details/usuario-details.component';
import { PreferenciasDetailsComponent } from './pages/preferencias-details/preferencias-details.component';

const routes: Routes = [
  { path: '', component: UsuarioDetailsComponent },
  { path: 'preferencias', component: PreferenciasDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
