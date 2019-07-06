import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTreeModule } from '@angular/material/tree';

import { AppMaterialModule } from '../../app-material.module';

import { ConversationComponent } from './conversation/conversation.component';
import { CommentCardComponent } from './conversation/comment-card.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';
import { TechnologyListModule } from '../technology-list/technology-list.module';
import { routes } from './conversation-routing';

@NgModule({
  declarations: [ConversationComponent, CommentCardComponent, SelectTechForConversationComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MatTreeModule, AppMaterialModule, TechnologyListModule]
})
export class ConversationModule {}
