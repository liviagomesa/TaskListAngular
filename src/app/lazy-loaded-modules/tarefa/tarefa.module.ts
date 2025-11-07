import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaCardComponent } from './components/tarefa-card/tarefa-card.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
import { TarefaFormComponent } from './pages/tarefa-form/tarefa-form.component';
import { TarefaDetailsComponent } from './pages/tarefa-details/tarefa-details.component';
import { TarefaRoutingModule } from './tarefa-routing.module';



@NgModule({
  declarations: [
    TarefaCardComponent,
    ListaTarefasComponent,
    TarefaFormComponent,
    TarefaDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TarefaRoutingModule
  ]
})
export class TarefaModule { }
