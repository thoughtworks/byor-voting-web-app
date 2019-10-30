import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, ReplaySubject, Observable } from 'rxjs';

import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';
import { ERRORS } from 'src/app/services/errors';
import { ErrorService } from 'src/app/services/error.service';
import { RecommendationCardComponent } from '../recommendation-card/recommendation-card.component';
import { map } from 'rxjs/operators';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit {
  @ViewChild('recommendationCard') recommendationCard: RecommendationCardComponent;

  showRecommendation$ = new ReplaySubject<boolean>(1);
  showCancelRecommendation$: Observable<boolean>;
  message$ = new Subject<string>();

  constructor(
    private backEnd: BackendService,
    private appSession: AppSessionService,
    private router: Router,
    private errorService: ErrorService,
    private votingEventService: VotingEventService
  ) {}

  ngOnInit() {
    const isRecommendationDefined = this.isRecommendationDefined();
    this.showRecommendation$.next(isRecommendationDefined);
    this.showCancelRecommendation$ = this.showRecommendation$.pipe(
      map((showRecommendation) => showRecommendation && this.canCancelRecommendation())
    );
  }

  signUp() {
    const eventId = this.votingEventService.getSelectedVotingEvent()._id;
    const techName = this.votingEventService.getSelectedTechnology().name;
    this.backEnd.signUpForRecommendation(eventId, techName).subscribe(
      () => {
        const tech = this.appSession.getSelectedTechnology();
        tech.recommendation = { author: this.appSession.getCredentials().userId };
        this.showRecommendation$.next(true);
      },
      (err) => {
        if (err.errorCode === ERRORS.recommendationAuthorAlreadySet) {
          this.message$.next(`${err.currentAuthor} already signed up`);
        } else {
          this.errorService.setError(err);
          this.router.navigate(['error']);
        }
      }
    );
  }

  cancel() {
    const eventId = this.votingEventService.getSelectedVotingEvent()._id;
    const techName = this.appSession.getSelectedTechnology().name;
    this.backEnd.resetRecommendation(eventId, techName).subscribe(
      () => {
        this.appSession.getSelectedTechnology().recommendation = null;
        this.showRecommendation$.next(false);
      },
      (err) => {
        this.errorService.setError(err);
        this.router.navigate(['error']);
      }
    );
  }

  isRecommendationDefined() {
    return !!(this.appSession.getSelectedTechnology() && this.appSession.getSelectedTechnology().recommendation);
  }
  canCancelRecommendation() {
    return this.isRecommendationAuthorTheLoggedUser();
  }
  isRecommendationAuthorTheLoggedUser() {
    return (
      this.isRecommendationDefined() &&
      this.appSession.getCredentials().userId === this.appSession.getSelectedTechnology().recommendation.author
    );
  }
}
