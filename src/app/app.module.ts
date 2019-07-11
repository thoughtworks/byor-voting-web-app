import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginModule } from './modules/shared/login/login.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { VoteModule } from './modules/vote/vote.module';
import { HttpErrorHandler } from './shared/http-error-handler/http-error-handler.service';
import { EventsService } from './services/events.service';
import { environment } from '../environments/environment';
import { getToken } from './utils/get-token';
import { VotingEventSelectComponent } from './components/voting-event-select/voting-event-select.component';
import { CanActivateStart } from './can-activate-start';

export function apiDomain() {
  return [new URL(environment.serviceUrl).hostname + ':' + new URL(environment.serviceUrl).port];
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: getToken,
    whitelistedDomains: apiDomain()
  };
}

@NgModule({
  declarations: [AppComponent, ErrorComponent, HeaderComponent, VotingEventSelectComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    VoteModule,
    LoginModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [HttpErrorHandler, EventsService, CanActivateStart],
  bootstrap: [AppComponent]
})
export class AppModule {}
