import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './standalone-pages/not-found/not-found.component';
import { LoginComponent } from './standalone-pages/login/login.component';
import { RegisterComponent } from './standalone-pages/register/register.component';
import { SecurityGuard } from './provided-in-root/security-and-guards/security.guard';

const routes: Routes = [
  { path: 'tarefas',
    loadChildren: () => import('./lazy-loaded-modules/tarefa/tarefa.module').then(m => m.TarefaModule),
    canActivate: [SecurityGuard], canLoad: [SecurityGuard]
  },
  { path: '', redirectTo: '/tarefas', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'usuario',
    loadChildren: () => import('./lazy-loaded-modules/usuario/usuario.module').then(m => m.UsuarioModule),
    canActivate: [SecurityGuard], canLoad: [SecurityGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
