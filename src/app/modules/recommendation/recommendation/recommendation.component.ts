import { Component, OnInit } from '@angular/core';
import { AppSessionService } from 'src/app/app-session.service';
import { VoteService } from '../../vote/services/vote.service';
import { BackendService } from 'src/app/services/backend.service';
import { getVotingEventFull$ } from 'src/app/utils/voting-event-flow.util';

@Component({
  selector: 'byor-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit {
  constructor(private appSession: AppSessionService, private voteService: VoteService, private backEnd: BackendService) {}

  ngOnInit() {}

  getVotingEvent$() {
    // @todo remove "|| this.voteService.credentials.votingEvent" once the enableVotingEventFlow toggle is removed
    const votingEvent = this.appSession.getSelectedVotingEvent() || this.voteService.credentials.votingEvent;
    return getVotingEventFull$(votingEvent, this.backEnd);
  }
}
