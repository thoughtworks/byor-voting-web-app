import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TechnologyListService } from '../../shared/technology-list/services/technology-list.service';
import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';
import { Technology } from 'src/app/models/technology';
import { map } from 'rxjs/operators';

@Component({
  selector: 'byor-select-tech-for-recommendation',
  templateUrl: './select-tech-for-recommendation.component.html',
  styleUrls: ['./select-tech-for-recommendation.component.scss']
})
export class SelectTechForRecommendationComponent implements OnInit, OnDestroy {
  technologyListSubscription: Subscription;

  constructor(
    private router: Router,
    private technologyListService: TechnologyListService,
    private appSession: AppSessionService,
    private backEnd: BackendService
  ) {}

  ngOnInit() {
    this.technologyListService.technologies$ = this.backEnd
      .getVotingEvent(this.appSession.getSelectedVotingEvent()._id)
      .pipe(map((event) => event.technologies));
    this.technologyListSubscription = this.technologyListService.technologySelected$.subscribe((tech) => this.goToNextPage(tech));
  }
  ngOnDestroy() {
    if (this.technologyListSubscription) {
      this.technologyListSubscription.unsubscribe();
    }
  }

  goToNextPage(technology: Technology) {
    this.router.navigate(['recommendation/recommendation']);
  }
}
