import { Routes } from '@angular/router';
import { StartVotingSessionComponent } from './start-voting-session/start-voting-session.component';
import { VoteComponent } from './vote/vote.component';

export const routes: Routes = [
  {
    path: 'vote',
    children: [
      { path: '', component: StartVotingSessionComponent },
      { path: 'start', component: VoteComponent }
    ]
  }
];
