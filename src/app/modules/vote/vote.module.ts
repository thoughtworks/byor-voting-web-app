import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app-material.module';
import { VoteComponent } from './vote/vote.component';
import { StartVotingSessionComponent } from './start-voting-session/start-voting-session.component';
import { VoteDialogueComponent } from './vote/vote-dialogue.component';
import { VoteSavedDialogueComponent } from './vote/vote-saved-dialogue.component';
import { VoteService } from './services/vote.service';
import { RouterModule } from '@angular/router';
import { routes } from './vote-routing';
import { HelpDialogueComponent } from './vote/help-dialogue/help-dialogue.component';
import { ConversationModule } from '../conversation/conversation.module';
import { TechnologyListModule } from '../shared/technology-list/technology-list.module';

@NgModule({
  declarations: [VoteComponent, StartVotingSessionComponent, VoteDialogueComponent, VoteSavedDialogueComponent, HelpDialogueComponent],
  imports: [RouterModule.forChild(routes), CommonModule, AppMaterialModule, ConversationModule, TechnologyListModule],
  entryComponents: [VoteDialogueComponent, VoteSavedDialogueComponent, HelpDialogueComponent],
  providers: [VoteService],
  exports: [StartVotingSessionComponent]
})
export class VoteModule {}
