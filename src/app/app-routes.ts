import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { ErrorComponent } from './components/error/error.component';

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
    path: 'vote',
    loadChildren: './modules/vote/vote.module#VoteModule'
  },
  {
    path: '**',
    redirectTo: 'vote',
  },
];
