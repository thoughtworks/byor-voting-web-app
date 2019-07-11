import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { merge, Subscription } from 'rxjs';

import { TechnologyListService } from '../../technology-list/services/technology-list.service';
import { AppSessionService } from 'src/app/app-session.service';
import { Technology } from 'src/app/models/technology';
import { getActionName } from 'src/app/utils/voting-event-flow.util';

@Component({
  selector: 'byor-select-tech',
  templateUrl: './select-tech.component.html',
  styleUrls: ['./select-tech.component.scss']
})
export class SelectTechComponent implements OnInit, OnDestroy {
  technologyListSubscription: Subscription;

  constructor(private router: Router, private technologyListService: TechnologyListService, private appSession: AppSessionService) {}

  ngOnInit() {
    this.technologyListSubscription = merge(this.technologyListService.technologySelected$).subscribe((tech) =>
      this.goToConversation(tech)
    );
  }
  ngOnDestroy() {
    if (this.technologyListSubscription) {
      this.technologyListSubscription.unsubscribe();
    }
  }

  goToConversation(technology: Technology) {
    this.appSession.setSelectedTechnology(technology);
    const votingEvent = this.appSession.getSelectedVotingEvent();
    const actionName = getActionName(votingEvent);
    if (actionName === 'conversation') {
      this.router.navigate(['conversation/conversation']);
    } else if (actionName === 'recommendation') {
      this.router.navigate(['recommendation/recommendation']);
    }
  }
}
