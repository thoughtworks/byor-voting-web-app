import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, merge, fromEvent, combineLatest, Subject, Subscription, NEVER } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap, startWith, share, debounceTime } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { VotingEvent } from '../../../models/voting-event';
import { VoteService } from '../services/vote.service';
import { ErrorService } from 'src/app/services/error.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { logError } from 'src/app/utils/utils';
import { AppSessionService } from 'src/app/app-session.service';

@Component({
  selector: 'byor-start-voting-session',
  templateUrl: './start-voting-session.component.html',
  styleUrls: ['./start-voting-session.component.scss']
})
export class StartVotingSessionComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('eventSelect') set eventSelect(select: MatSelect) {
    if (!select) {
      return;
    }

    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
    this.selectionChangeSubscription = select.selectionChange
      .pipe(switchMap((selection) => this.openVotingEvents$.pipe(map((events) => events.find((e) => e.name === selection.value)))))
      .subscribe((eSel) => {
        this.eventSelectionChanged$.next(eSel);
      });
  }

  constructor(
    private router: Router,
    private voteService: VoteService,
    private errorService: ErrorService,
    private configurationService: ConfigurationService,
    private appSession: AppSessionService
  ) {}
  openVotingEvents$: Observable<Array<VotingEvent>>;

  eventSelectionChanged$ = new Subject<VotingEvent>();
  moreThanOneOpenEvent$: Observable<Array<VotingEvent>>;
  votingEvent$: Observable<VotingEvent>;
  isValidInputData$: Observable<boolean>;
  message$ = new Subject<string>();

  goToVoteSubscription: Subscription;
  selectionChangeSubscription: Subscription;

  configuration$: Observable<any>;

  @ViewChild('voterFirstName') voterFirstName: ElementRef;
  @ViewChild('voterLastName') voterLastName: ElementRef;
  @ViewChild('startButton', { read: ElementRef }) startButtonRef: ElementRef;

  ngOnInit() {
    this.configuration$ = this.configurationService.defaultConfiguration().pipe(shareReplay(1));
  }

  ngAfterViewInit() {
    // notify when first and last name are changed
    const firstName$ = fromEvent(this.voterFirstName.nativeElement, 'keyup').pipe(
      debounceTime(300),
      map(() => this.voterFirstName.nativeElement.value)
    );
    const lastName$ = fromEvent(this.voterLastName.nativeElement, 'keyup').pipe(
      debounceTime(300),
      map(() => this.voterLastName.nativeElement.value)
    );

    const startButtonClick$ = fromEvent(this.startButtonRef.nativeElement, 'click');

    // the main subscription
    this.goToVoteSubscription = this.goToVote$(this.eventSelectionChanged$, firstName$, lastName$, startButtonClick$)
      .pipe(
        tap((credentials) => {
          // @todo added to gather info for a bug found in production - to be removed once fixed
          if (!credentials.voterId) {
            this.errorService.saveErrorInfo('credentials.voterId not defined', JSON.stringify(credentials, null, 2));
          }
        })
      )
      .subscribe(
        (credentials) => {
          this.voteService.credentials = credentials;
          this.appSession.setSelectedVotingEvent(credentials.votingEvent);
          this.router.navigate(['vote/start']);
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
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
  }

  // this method takes in input all Observable created out of DOM events which are relevant for this Component
  // in this way we can easily test this logic with marble tests
  goToVote$(
    selectionChanged$: Observable<VotingEvent>,
    firstName$: Observable<string>,
    lastName$: Observable<string>,
    startButtonClick$: Observable<any>
  ) {
    this.openVotingEvents$ = this.voteService.getVotingEvents().pipe(
      map((events) => events.filter((event) => event.status === 'open')),
      tap((openEvents) => {
        if (openEvents.length === 0) {
          this.message$.next(`There are no open voting events`);
        }
      }),
      shareReplay(1)
    );

    // notifies when there is just one open event retrieved from the backend
    const justOneOpenEvent$ = this.openVotingEvents$.pipe(
      filter((events) => events.length === 1),
      map((events) => events[0])
    );
    // notifies when there is more than one open event retrieved from the backend
    this.moreThanOneOpenEvent$ = this.openVotingEvents$.pipe(
      startWith([]), // for html template until the response comes back
      filter((events) => events.length > 1),
      share()
    );

    this.votingEvent$ = merge(justOneOpenEvent$, selectionChanged$).pipe(share());

    const inputData$ = combineLatest([this.votingEvent$, firstName$, lastName$]);

    // notifies when any of the input data provided changes - the value notified is true of false
    // depending on the fact that the input data is valid or not
    this.isValidInputData$ = inputData$.pipe(
      map(([event, firstName, lastName]) => this.isInputDataValid(event, firstName, lastName)),
      share()
    );

    const clickOnVote$ = combineLatest([this.isValidInputData$, inputData$]).pipe(
      switchMap(([isValid, [votingEvent, firstName, lastName]]) => {
        if (!isValid) {
          return NEVER;
        }
        return startButtonClick$.pipe(
          map(() => ({ voterId: { firstName, lastName }, votingEvent })),
          tap((creds) => {
            this.voteService.setVoter(creds.voterId);
            this.voteService.setSelectedEvent(creds.votingEvent);
          })
        );
      })
    );

    // notifies when the user has clicked to go to voting session and he has not voted yet
    return clickOnVote$.pipe(
      switchMap((credentials) =>
        this.voteService.hasVotedForEvent().pipe(
          tap((hasAlreadyVoted) => {
            if (hasAlreadyVoted) {
              this.message$.next(`You have already voted for <strong>${credentials.votingEvent.name}</strong>`);
            }
          }),
          filter((hasAlreadyVoted) => !hasAlreadyVoted),
          map(() => credentials)
        )
      )
    );
  }

  isInputDataValid(event: VotingEvent, firstName: string, lastName: string) {
    return event && firstName.trim().length > 0 && lastName.trim().length > 0;
  }
}
