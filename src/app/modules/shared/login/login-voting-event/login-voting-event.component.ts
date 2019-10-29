import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, fromEvent, combineLatest, Subscription, merge, throwError, NEVER } from 'rxjs';
import { map, share, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ERRORS } from 'src/app/services/errors';
import { getActionRoute } from 'src/app/utils/voting-event-flow.util';
import { AppSessionService } from 'src/app/app-session.service';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-login-voting-event',
  templateUrl: './login-voting-event.component.html',
  styleUrls: ['./login-voting-event.component.scss']
})
export class LoginVotingEventComponent implements AfterViewInit, OnDestroy {
  user$: Observable<string>;
  password$: Observable<string>;
  inputData$: Observable<any>;
  isValidInputData$: Observable<boolean>;
  clickOnLogin$: Observable<{ user: string; password: string }>;
  message$ = new Subject<string>();

  loginSubscription: Subscription;

  @ViewChild('userid') userid: ElementRef;
  @ViewChild('pwd') pwd: ElementRef;
  @ViewChild('loginButton', { read: ElementRef }) loginButtonRef: ElementRef;

  constructor(
    public authService: AuthService,
    public router: Router,
    public errorService: ErrorService,
    public appSession: AppSessionService,
    private votingEventService: VotingEventService
  ) {}

  ngAfterViewInit() {
    const _user$ = fromEvent(this.userid.nativeElement, 'keyup').pipe(map(() => this.userid.nativeElement.value));
    const _password$ = fromEvent(this.pwd.nativeElement, 'keyup').pipe(map(() => this.pwd.nativeElement.value));
    const _loginButtonClick$ = fromEvent(this.loginButtonRef.nativeElement, 'click');

    this.loginSubscription = this.logIn$(_user$, _password$, _loginButtonClick$).subscribe(
      ({ resp, userId }) => {
        this.authService.isLoggedIn = !!resp;
        this.appSession.setCredentials({ userId });
        const redirect = getActionRoute(this.votingEventService.getSelectedVotingEvent());
        this.router.navigate([redirect]);
      },
      (error) => {
        this.errorService.setError(error);
        this.router.navigate(['error']);
      }
    );
  }
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  // this method takes in input all Observable created out of DOM events which are relevant for this Component
  // in this way we can easily test this logic with marble tests
  logIn$(userId$: Observable<string>, pwd$: Observable<string>, loginButtonClick$: Observable<any>) {
    this.user$ = merge(
      // we need to create an Observable which emits the initial value of the inpuf field.
      // This is because, in case of error, the `catchError` operator returns the source Observable and, at that point,
      // this merge function would be re-executed and it would be important to emit the current content of the input field
      new Observable((subscriber) => {
        subscriber.next(this.userid.nativeElement.value);
        subscriber.complete();
      }),
      userId$
    );
    this.password$ = merge(
      // we need to create an Observable which emits the initial value of the inpuf field.
      // This is because, in case of error, the `catchError` operator returns the source Observable and, at that point,
      // this merge function would be re-executed and it would be important to emit the current content of the input field
      new Observable((subscriber) => {
        subscriber.next(this.pwd.nativeElement.value);
        subscriber.complete();
      }),
      pwd$
    );

    this.inputData$ = combineLatest([this.user$, this.password$]);
    this.isValidInputData$ = this.inputData$.pipe(
      map(([user, password]) => this.isInputDataValid(user, password)),
      share() // isValidInputData$ is subscribed in the template via asyc pipe - any other subscriber should use this subscription
    );

    this.clickOnLogin$ = combineLatest([this.isValidInputData$, this.inputData$]).pipe(
      switchMap(([isValid, [user, password]]) => {
        if (isValid) {
          return loginButtonClick$.pipe(map(() => ({ user, password })));
        } else {
          return NEVER;
        }
      })
    );

    let credentials;
    return this.clickOnLogin$.pipe(
      switchMap((_credentials) => {
        credentials = _credentials;
        const _votingEvent = this.votingEventService.getSelectedVotingEvent();
        return this.authService
          .loginForVotingEvent(credentials.user, credentials.password, _votingEvent._id)
          .pipe(map((resp) => ({ resp, userId: credentials.user })));
      }),
      catchError((err, caught) => {
        if (err.errorCode === ERRORS.serverUnreacheable) {
          return throwError(err.message);
        }
        if (err.message) {
          this.message$.next(err.message);
          throw err;
        }
      })
    );
  }

  isInputDataValid(user: string, password: string) {
    return user.trim().length > 0 && password.trim().length > 0;
  }
}
