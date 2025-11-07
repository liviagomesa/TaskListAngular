import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import '@angular/common/locales/global/pt';
import { FormsModule } from '@angular/forms';
import { TarefaModule } from './lazy-loaded-modules/tarefa/tarefa.module';
import { HeaderComponent } from './root-components/header/header.component';
import { NotFoundComponent } from './standalone-pages/not-found/not-found.component';
import { LoginComponent } from './standalone-pages/login/login.component';
import { UserDropdownComponent } from './root-components/user-dropdown/user-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
    LoginComponent,
    UserDropdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TarefaModule,
    NgbModule
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
