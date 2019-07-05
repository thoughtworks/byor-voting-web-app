import { Routes } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';

export const routes: Routes = [
  {
    path: 'vote/conversation',
    children: [{ path: '', component: ConversationComponent }]
  }
];
