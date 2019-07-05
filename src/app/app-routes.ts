import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { VotingEventSelectComponent } from './components/voting-event-select/voting-event-select.component';
import { LoginVotingEventComponent } from './modules/login/login-voting-event/login-voting-event.component';
import { NicknameComponent } from './modules/login/nickname/nickname.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'error',
    component: ErrorComponent,
    data: { title: 'Error' }
  },
  {
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule'
  },
  {
    path: 'selectVotingEvent',
    component: VotingEventSelectComponent
  },
  {
    path: 'login-voting-event',
    component: LoginVotingEventComponent
  },
  {
    path: 'nickname',
    component: NicknameComponent
  },
  {
    path: 'vote',
    loadChildren: './modules/vote/vote.module#VoteModule'
  }
  // {
  //   path: '**',
  //   redirectTo: 'vote',
  // },
];
