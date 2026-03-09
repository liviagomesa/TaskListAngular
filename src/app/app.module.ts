import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import '@angular/common/locales/global/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TarefaModule } from './lazy-loaded-modules/tarefa/tarefa.module';
import { HeaderComponent } from './root-components/header/header.component';
import { NotFoundComponent } from './standalone-pages/not-found/not-found.component';
import { LoginComponent } from './standalone-pages/login/login.component';
import { UserDropdownComponent } from './root-components/user-dropdown/user-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './provided-in-root/security-and-guards/auth.interceptor';

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
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      extendedTimeOut: 2000,   // tempo extra se o usuário passar o mouse em cima
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,        // mostra um X para fechar manualmente
      progressBar: true,        // barra de progresso mostrando o tempo restante
      //enableHtml: true,         // permite HTML na mensagem (ex: links, negrito)
    })
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
