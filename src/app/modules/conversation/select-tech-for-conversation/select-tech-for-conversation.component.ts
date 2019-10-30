import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Technology } from 'src/app/models/technology';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-select-tech-for-conversation',
  templateUrl: './select-tech-for-conversation.component.html',
  styleUrls: ['./select-tech-for-conversation.component.scss']
})
export class SelectTechForConversationComponent implements OnInit, OnDestroy {
  votingEventSubscription: Subscription;
  technologyListSubscription: Subscription;

  constructor(private router: Router, private votingEventService: VotingEventService) {}

  ngOnInit() {
    const votingEventShallow = this.votingEventService.getSelectedVotingEvent();
    // retrieve the details of the voting event
    this.votingEventSubscription = this.votingEventService.getVotingEvent$(votingEventShallow._id).subscribe();
    this.technologyListSubscription = this.votingEventService.selectedTechnology$.subscribe((tech) => this.goToNextPage(tech));
  }
  ngOnDestroy() {
    if (this.votingEventSubscription) {
      this.votingEventSubscription.unsubscribe();
    }
    if (this.technologyListSubscription) {
      this.technologyListSubscription.unsubscribe();
    }
  }

  goToNextPage(technology: Technology) {
    this.router.navigate(['conversation/conversation']);
  }
}
