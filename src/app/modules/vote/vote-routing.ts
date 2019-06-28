import { Routes } from '@angular/router';
import { StartVotingSessionComponent } from './start-voting-session/start-voting-session.component';
import { VoteComponent } from './vote/vote.component';
import { ConversationComponent } from '../conversation/conversation/conversation.component';

export const routes: Routes = [
  {
    path: 'vote',
    children: [
      { path: '', component: StartVotingSessionComponent },
      { path: 'start', component: VoteComponent },
      { path: 'conversation', component: ConversationComponent }
    ]
  }
];
