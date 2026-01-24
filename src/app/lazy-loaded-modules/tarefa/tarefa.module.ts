import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaCardComponent } from './components/tarefa-card/tarefa-card.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaTarefasComponent } from './pages/lista-tarefas/lista-tarefas.component';
import { TarefaFormComponent } from './pages/tarefa-form/tarefa-form.component';
import { TarefaDetailsComponent } from './pages/tarefa-details/tarefa-details.component';
import { TarefaRoutingModule } from './tarefa-routing.module';
import { ImportanciaTarefaPipe } from './enums/importancia-tarefa.pipe';



@NgModule({
  declarations: [
    TarefaCardComponent,
    ListaTarefasComponent,
    TarefaFormComponent,
    TarefaDetailsComponent,
    ImportanciaTarefaPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TarefaRoutingModule,
    ReactiveFormsModule
  ]
})
export class TarefaModule { }
