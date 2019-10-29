import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, fromEvent, Subscription, NEVER } from 'rxjs';
import { shareReplay, map, share, switchMap } from 'rxjs/operators';

import { AppSessionService } from 'src/app/app-session.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ErrorService } from 'src/app/services/error.service';
import { logError } from 'src/app/utils/utils';
import { getActionRoute } from 'src/app/utils/voting-event-flow.util';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss']
})
export class NicknameComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    public appSession: AppSessionService,
    public votingEventService: VotingEventService,
    private configurationService: ConfigurationService
  ) {}

  isValidInputData$: Observable<boolean>;
  message$ = new Subject<string>();
  configuration$: Observable<any>;

  goToVoteSubscription: Subscription;

  @ViewChild('nickname') voterFirstName: ElementRef;
  @ViewChild('startButton', { read: ElementRef }) startButtonRef: ElementRef;

  ngOnInit() {
    this.configuration$ = this.configurationService.defaultConfiguration().pipe(shareReplay(1));
  }

  ngAfterViewInit() {
    // notify when nickname is changed
    const nickname$ = fromEvent(this.voterFirstName.nativeElement, 'keyup').pipe(map(() => this.voterFirstName.nativeElement.value));

    const startButtonClick$ = fromEvent(this.startButtonRef.nativeElement, 'click');

    // the main subscription
    this.goToVoteSubscription = this.goToVote$(nickname$, startButtonClick$).subscribe(
      (nickname) => {
        this.appSession.setCredentials({ nickname });
        const redirect = getActionRoute(this.votingEventService.getSelectedVotingEvent());
        this.router.navigate([redirect]);
      },
      (error) => {
        logError(error);
        let _errMsg = error;
        if (error.message) {
          _errMsg = error.message;
        }
        this.errorService.setError(_errMsg);
        this.router.navigate(['error']);
      }
    );
  }

  ngOnDestroy() {
    if (this.goToVoteSubscription) {
      this.goToVoteSubscription.unsubscribe();
    }
  }

  // this method takes in input all Observables created out of DOM events which are relevant for this Component
  goToVote$(nickname$: Observable<string>, startButtonClick$: Observable<any>) {
    // notifies when the input data provided changes - the value notified is true of false
    // depending on the fact that the input data is valid or not
    this.isValidInputData$ = nickname$.pipe(
      map((nickname) => this.isNicknameValid(nickname)),
      share() // share() is used since this Observable is used also on the Html template
    );

    return nickname$.pipe(switchMap((nickname) => (this.isNicknameValid(nickname) ? startButtonClick$.pipe(map(() => nickname)) : NEVER)));
  }

  isNicknameValid(nickname: string) {
    return nickname && nickname.trim().length > 0;
  }
}
