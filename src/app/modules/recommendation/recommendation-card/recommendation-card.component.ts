import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ReplaySubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mostVotedRings, Recommendation } from 'src/app/models/technology';
import { AppSessionService } from 'src/app/app-session.service';
import { TwRings } from 'src/app/models/ring';
import { BackendService } from 'src/app/services/backend.service';
import { ErrorService } from 'src/app/services/error.service';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent implements OnInit {
  rings = TwRings.names;
  @ViewChild('recommendationText') recommendationElRef: ElementRef;

  placeholderText: string;

  recommendation$: Observable<Recommendation>;
  recommendationAuthor$: Observable<string>;
  recommendationRing$: Observable<string>;
  recommendationTextSelectedTech$: Observable<string>;
  canEdit$: Observable<boolean>;

  message$ = new Subject();
  errorMessage$ = new Subject();
  ringsSelected$ = new ReplaySubject<string>(1);
  ringsSelected: string;

  constructor(
    private appSession: AppSessionService,
    private backEnd: BackendService,
    private router: Router,
    private errorService: ErrorService,
    private votingEventService: VotingEventService
  ) {}

  ngOnInit() {
    this.recommendation$ = this.votingEventService.selectedTechnology$.pipe(map((tech) => tech.recommendation));
    this.recommendationAuthor$ = this.recommendation$.pipe(map((recommendation) => (recommendation ? recommendation.author : null)));
    this.recommendationRing$ = this.recommendation$.pipe(map((recommendation) => (recommendation ? recommendation.ring : null)));
    this.recommendationTextSelectedTech$ = this.recommendation$.pipe(
      map((recommendation) => (recommendation ? recommendation.text : null))
    );
    this.canEdit$ = this.recommendation$.pipe(
      map((recommendation) => {
        return recommendation && recommendation.author === this.appSession.getCredentials().userId;
      })
    );
    const selectedTech = this.appSession.getSelectedTechnology();
    if (selectedTech.recommendation && selectedTech.recommendation.text) {
      this.setRing(selectedTech.recommendation.ring);
      return; // exits here since the Recommendation exists and it drives which is the ring
    }

    // This logic calculates the suggested ring based on the votes gathered
    // maxVotes contains the rings which have collected the highest number of votes
    // it is an array to contemplate the possibility that 2 or more rings can receive the same numberof votes
    const maxVotes = mostVotedRings(selectedTech);

    if (maxVotes.length === 1) {
      this.oneRingWithMaxVotes(maxVotes[0].ring);
    } else if (maxVotes.length > 1) {
      this.moreThanOneRingWithMaxVotes();
    } else {
      this.noVotes();
    }
  }

  oneRingWithMaxVotes(ringsWithMaxVotes: string) {
    this.setRing(ringsWithMaxVotes);
    const text = `Confirm ring ${ringsWithMaxVotes} or choose a different ring specifying the reasons in the comment`;
    this.placeholderText = text;
  }
  moreThanOneRingWithMaxVotes() {
    this.setRing('');
    const text = `More than one ring got max number of votes. Choose a ring specifying the reasons in the comment`;
    this.placeholderText = text;
  }
  noVotes() {
    this.setRing('');
    const text = `Choose a ring specifying the reasons in the comment`;
    this.placeholderText = text;
  }

  getRecommendationTextFromView() {
    return this.recommendationElRef.nativeElement.value;
  }
  ringButtonClass$(ring: string) {
    return this.ringsSelected$.pipe(map((_ring) => (ring.toLowerCase() === _ring.toLowerCase() ? 'selected-ring-button' : 'ring-button')));
  }
  setRing(ring) {
    this.ringsSelected = ring;
    this.ringsSelected$.next(ring);
  }
  save() {
    this.cleanMessages();
    const selectedTech = this.appSession.getSelectedTechnology();
    const recommendationText = this.getRecommendationTextFromView();

    if (!recommendationText || recommendationText.trim().length === 0) {
      this.errorMessage$.next(`It is mandatory to add a comment to the recommendation`);
      return;
    }
    if (!this.ringsSelected) {
      this.errorMessage$.next(`It is mandatory to choose a ring for the recommendation`);
      return;
    }
    const eventId = this.votingEventService.getSelectedVotingEvent()._id;
    const techName = this.appSession.getSelectedTechnology().name;
    const recommendation: Recommendation = {
      ring: this.ringsSelected,
      text: recommendationText
    };

    this.backEnd.setRecommendation(eventId, techName, recommendation).subscribe(
      () => {
        selectedTech.recommendation = recommendation;
        this.message$.next(`Recommendation saved`);
      },
      (err) => {
        this.errorService.setError(err);
        console.error(err);
        this.router.navigate(['error']);
      }
    );
  }
  cleanMessages() {
    this.message$.next(false);
    this.errorMessage$.next(false);
  }
}
