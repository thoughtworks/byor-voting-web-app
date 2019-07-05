import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';

import { AppMaterialModule } from '../../app-material.module';

import { ConversationComponent } from './conversation/conversation.component';
import { CommentCardComponent } from './conversation/comment-card.component';

@NgModule({
  declarations: [ConversationComponent, CommentCardComponent],
  imports: [CommonModule, MatTreeModule, AppMaterialModule]
})
export class ConversationModule {}
