import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';
import { ERRORS } from 'src/app/services/errors';
import { ErrorService } from 'src/app/services/error.service';
import { mostVotedRings, Recommendation } from 'src/app/models/technology';
import { RecommendationCardComponent } from '../recommendation-card/recommendation-card.component';

@Component({
  selector: 'byor-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent {
  @ViewChild('recommendationCard') recommendationCard: RecommendationCardComponent;

  showSignUpButton$ = new BehaviorSubject<boolean>(true);
  message$ = new Subject();

  constructor(
    private backEnd: BackendService,
    private appSession: AppSessionService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  signUp() {
    const eventId = this.appSession.getSelectedVotingEvent()._id;
    const techName = this.appSession.getSelectedTechnology().name;
    this.backEnd.setRecommendationAuthor(eventId, techName).subscribe(
      () => this.showSignUpButton$.next(false),
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

  quit() {
    const eventId = this.appSession.getSelectedVotingEvent()._id;
    const techName = this.appSession.getSelectedTechnology().name;
    const userId = this.appSession.getCredentials().userId || this.appSession.getCredentials().nickname;
    this.backEnd.resetRecommendation(eventId, techName).subscribe(
      () => {
        this.appSession.getSelectedTechnology().recommendation = null;
        this.showSignUpButton$.next(true);
      },
      (err) => {
        this.errorService.setError(err);
        this.router.navigate(['error']);
      }
    );
  }

  recommendationButtonText() {
    const recommendation = this.appSession.getSelectedTechnology().recommendation;
    return recommendation && recommendation.text ? 'Review recommendation' : 'Sign up for Recommendation';
  }

  saveRecommendation() {
    const selectedTech = this.appSession.getSelectedTechnology();
    const recommendationText = this.recommendationCard.getRecommendationTextFromView();
    // maxVotes contains the rings which have collected the highest number of votes
    // it is an array to contemplated the possibility that 2 or more rings can receive the same numberof votes
    const maxVotes = mostVotedRings(selectedTech);

    if (!recommendationText) {
      throw Error(`It is mandatory to add a comment to the recommendation`);
    }
    const author = this.appSession.getCredentials().userId || this.appSession.getCredentials().userId;
    const eventId = this.appSession.getSelectedVotingEvent()._id;
    const techName = this.appSession.getSelectedTechnology().name;
    const recommendation: Recommendation = {
      author,
      ring: maxVotes[0].ring,
      text: recommendationText
    };

    this.backEnd.setRecommendation(eventId, techName, recommendation).subscribe(
      () => {
        this.appSession.getSelectedTechnology().recommendation.text = recommendationText;
        this.message$.next(`Recommendation saved`);
      },
      (err) => {
        this.errorService.setError(err);
        console.error(err);
        this.router.navigate(['error']);
      }
    );
  }
}
