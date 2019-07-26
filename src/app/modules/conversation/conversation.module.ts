import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from '../../app-material.module';
import { TechnologyListModule } from '../shared/technology-list/technology-list.module';
import { routes } from './conversation-routing';

import { ConversationComponent } from './conversation/conversation.component';
import { SelectTechForConversationComponent } from './select-tech-for-conversation/select-tech-for-conversation.component';
import { CommentTreesModule } from '../shared/comment-trees/comment-trees.module';
import { TechnologyVotingResultsModule } from '../shared/technology-voting-results/technology-voting-results.module';
import { TwBlipsModule } from '../shared/tw-blips/tw-blips.module';
@NgModule({
  declarations: [ConversationComponent, SelectTechForConversationComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AppMaterialModule,
    TechnologyListModule,
    CommentTreesModule,
    TechnologyVotingResultsModule,
    TwBlipsModule
  ]
})
export class ConversationModule {}
