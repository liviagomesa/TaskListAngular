import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioDetailsComponent } from './pages/usuario-details/usuario-details.component';
import { FormGuard } from 'src/app/core/security-and-guards/form.guard';
import { UsuarioResolver } from './usuario.resolver';

const routes: Routes = [
  // sem "/" para ser relativo
  { path: '', redirectTo: 'me', pathMatch: 'full' },
  { path: 'me', component: UsuarioDetailsComponent, resolve: { dto: UsuarioResolver }, canDeactivate: [FormGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
