import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TechnologyListService } from '../../shared/technology-list/services/technology-list.service';
import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';
import { Technology } from 'src/app/models/technology';
import { getVotingEventFull$ } from 'src/app/utils/voting-event-flow.util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'byor-select-tech-for-conversation',
  templateUrl: './select-tech-for-conversation.component.html',
  styleUrls: ['./select-tech-for-conversation.component.scss']
})
export class SelectTechForConversationComponent implements OnInit, OnDestroy {
  technologyListSubscription: Subscription;

  constructor(
    private router: Router,
    private technologyListService: TechnologyListService,
    private appSession: AppSessionService,
    private backEnd: BackendService
  ) {}

  ngOnInit() {
    this.technologyListService.technologies$ = getVotingEventFull$(this.appSession.getSelectedVotingEvent(), this.backEnd).pipe(
      map((event) => event.technologies)
    );
    this.technologyListSubscription = this.technologyListService.technologySelected$.subscribe((tech) => this.goToNextPage(tech));
  }
  ngOnDestroy() {
    if (this.technologyListSubscription) {
      this.technologyListSubscription.unsubscribe();
    }
  }

  goToNextPage(technology: Technology) {
    this.router.navigate(['conversation/conversation']);
  }
}
