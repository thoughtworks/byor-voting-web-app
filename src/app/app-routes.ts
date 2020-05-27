import { Routes } from '@angular/router';
import { LoginComponent } from './modules/shared/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { VotingEventSelectComponent } from './components/voting-event-select/voting-event-select.component';
import { LoginVotingEventComponent } from './modules/shared/login/login-voting-event/login-voting-event.component';
import { NicknameComponent } from './modules/shared/login/nickname/nickname.component';
import { AppComponent } from './app.component';
import { EmailComponent } from './modules/shared/login/email/email.component';

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
    path: 'email',
    component: EmailComponent
  },
  {
    path: 'refresh',
    component: AppComponent
  },
  {
    path: 'vote',
    loadChildren: './modules/vote/vote.module#VoteModule'
  },
  {
    path: 'conversation',
    loadChildren: './modules/conversation/conversation.module#ConversationModule'
  },
  {
    path: 'recommendation',
    loadChildren: './modules/recommendation/recommendation.module#RecommendationModule'
  }
  // {
  //   path: '**',
  //   redirectTo: 'vote',
  // },
];
