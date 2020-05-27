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
  selector: 'byor-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements AfterViewInit, OnDestroy, OnInit {
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

  @ViewChild('email') voterFirstName: ElementRef;
  @ViewChild('startButton', { read: ElementRef }) startButtonRef: ElementRef;

  ngOnInit() {
    this.configuration$ = this.configurationService.defaultConfiguration().pipe(shareReplay(1));
  }

  ngAfterViewInit() {
    // notify when email is changed
    const email$ = fromEvent(this.voterFirstName.nativeElement, 'keyup').pipe(map(() => this.voterFirstName.nativeElement.value));

    const startButtonClick$ = fromEvent(this.startButtonRef.nativeElement, 'click');

    // the main subscription
    this.goToVoteSubscription = this.goToVote$(email$, startButtonClick$).subscribe(
      (email) => {
        this.appSession.setCredentials({ nickname: email });
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
  goToVote$(email$: Observable<string>, startButtonClick$: Observable<any>) {
    // notifies when the input data provided changes - the value notified is true of false
    // depending on the fact that the input data is valid or not
    this.isValidInputData$ = email$.pipe(
      map((email) => this.isEmailValid(email)),
      share() // share() is used since this Observable is used also on the Html template
    );

    return email$.pipe(switchMap((email) => (this.isEmailValid(email) ? startButtonClick$.pipe(map(() => email)) : NEVER)));
  }

  isEmailValid(email: string) {
    const re = /\S+@\S+\.\S+/;
    return email && email.trim().length > 0 && re.test(email);
  }
}
