import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TechnologyListService } from '../../shared/technology-list/services/technology-list.service';
import { Technology } from 'src/app/models/technology';
import { AppSessionService } from 'src/app/app-session.service';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-select-tech-for-recommendation',
  templateUrl: './select-tech-for-recommendation.component.html',
  styleUrls: ['./select-tech-for-recommendation.component.scss']
})
export class SelectTechForRecommendationComponent implements OnInit, OnDestroy {
  votingEventSubscription: Subscription;
  technologyListSubscription: Subscription;

  constructor(
    private router: Router,
    private appSession: AppSessionService,
    private votingEventService: VotingEventService,
    private technologyListService: TechnologyListService
  ) {}

  ngOnInit() {
    const votingEventShallow = this.appSession.getSelectedVotingEvent();
    // retrieve the details of the voting event
    this.votingEventSubscription = this.votingEventService.getVotingEvent(votingEventShallow._id).subscribe();
    this.technologyListSubscription = this.technologyListService.technologySelected$.subscribe((tech) => this.goToNextPage(tech));
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
    this.router.navigate(['recommendation/recommendation']);
  }
}
