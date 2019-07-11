import { Routes } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';
import { SelectTechComponent } from '../shared/technology-list/select-tech/select-tech.component';
import { CanActivateStart } from '../../can-activate-start';

export const routes: Routes = [
  {
    path: 'conversation',
    canActivate: [CanActivateStart],
    children: [{ path: '', component: SelectTechComponent }, { path: 'conversation', component: ConversationComponent }]
  }
];
