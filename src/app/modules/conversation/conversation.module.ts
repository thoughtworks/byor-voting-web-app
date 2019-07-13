import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatTreeModule } from '@angular/material/tree';

import { AppMaterialModule } from '../../app-material.module';
import { TechnologyListModule } from '../shared/technology-list/technology-list.module';
import { routes } from './conversation-routing';

import { ConversationComponent } from './conversation/conversation.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';
import { CommentTreesModule } from '../shared/comment-trees/comment-trees.module';
@NgModule({
  declarations: [ConversationComponent, SelectTechForConversationComponent],
  imports: [RouterModule.forChild(routes), CommonModule, AppMaterialModule, MatTreeModule, TechnologyListModule, CommentTreesModule]
})
export class ConversationModule {}
