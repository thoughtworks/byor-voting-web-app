import { Routes } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';
import { CanActivateStart } from 'src/app/can-activate-start';

export const routes: Routes = [
  {
    path: 'conversation',
    canActivate: [CanActivateStart],
    children: [{ path: '', component: SelectTechForConversationComponent }, { path: 'conversation', component: ConversationComponent }]
  }
];
