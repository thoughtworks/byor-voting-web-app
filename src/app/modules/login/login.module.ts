import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AppMaterialModule } from '../../app-material.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  exports: [
    LoginComponent,
  ]
})
export class LoginModule { }
