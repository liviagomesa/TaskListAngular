import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarefaDeListaComponent } from './tarefa-de-lista/tarefa-de-lista.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TarefaDeListaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    TarefaDeListaComponent // torna o componente visível para outros módulos (não basta só importar este módulo)
  ]
})
export class TarefaModule { }
