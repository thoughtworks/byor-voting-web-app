import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {VotersListComponent} from './voters-list/voters-list.component';
import { AuthGuard } from '../login/auth.guard';
import { VoteCloudComponent } from './vote-cloud/vote-cloud.component';

const routes: Routes = [
  {
    path: 'voters',
    component: VotersListComponent
  },
  {
    path: 'vote-cloud',
    component: VoteCloudComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AdminDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
