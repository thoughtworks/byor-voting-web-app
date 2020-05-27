import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../../app-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VotingEventComponent } from './voting-event/voting-event.component';
import { VotersListComponent } from './voters-list/voters-list.component';
import { VoteCloudComponent } from './vote-cloud/vote-cloud.component';

@NgModule({
  declarations: [AdminDashboardComponent, VotingEventComponent, VotersListComponent, VoteCloudComponent],
  imports: [CommonModule, ReactiveFormsModule, AppMaterialModule, AdminRoutingModule],
  providers: []
})
export class AdminModule {}
