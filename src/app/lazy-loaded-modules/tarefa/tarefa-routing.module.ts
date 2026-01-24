import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
import { TarefaFormComponent } from './pages/tarefa-form/tarefa-form.component';
import { TarefaDetailsComponent } from './pages/tarefa-details/tarefa-details.component';
import { TarefaResolver } from './tarefa.resolver';
import { FormGuard } from 'src/app/provided-in-root/security-and-guards/form.guard';

const routes: Routes = [
  { path: '', component: ListaTarefasComponent },
  { path: 'new', component: TarefaFormComponent, canDeactivate: [FormGuard] },
  { path: ':id', component: TarefaDetailsComponent, resolve: { entity: TarefaResolver } },
  { path: ':id/edit', component: TarefaFormComponent, resolve: { entity: TarefaResolver }, canDeactivate: [FormGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarefaRoutingModule { }
