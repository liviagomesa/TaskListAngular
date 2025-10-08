import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TarefaDeListaComponent } from './tarefa-de-lista/tarefa-de-lista.component';

import '@angular/common/locales/global/pt';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TarefaDeListaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
