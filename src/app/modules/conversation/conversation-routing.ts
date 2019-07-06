import { Routes } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';

export const routes: Routes = [
  {
    path: 'conversation',
    children: [{ path: '', component: SelectTechForConversationComponent }, { path: 'conversation', component: ConversationComponent }]
  }
];
