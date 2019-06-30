import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AppMaterialModule } from '../../app-material.module';
import { LoginVotingEventComponent } from './login-voting-event/login-voting-event.component';

@NgModule({
  declarations: [LoginComponent, LoginVotingEventComponent],
  providers: [AuthGuard, AuthService],
  imports: [CommonModule, AppMaterialModule],
  exports: [LoginComponent]
})
export class LoginModule {}
