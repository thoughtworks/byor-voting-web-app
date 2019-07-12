import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTreeModule } from '@angular/material/tree';

import { AppMaterialModule } from '../../app-material.module';
import { TechnologyListModule } from '../shared/technology-list/technology-list.module';
import { routes } from './conversation-routing';

import { ConversationComponent } from './conversation/conversation.component';
import { CommentCardComponent } from './conversation/comment-card.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';
@NgModule({
  declarations: [ConversationComponent, CommentCardComponent, SelectTechForConversationComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MatTreeModule, AppMaterialModule, TechnologyListModule]
})
export class ConversationModule {}
