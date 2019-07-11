import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, fromEvent, combineLatest, never, Subscription, merge, throwError } from 'rxjs';
import { map, share, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ERRORS } from 'src/app/services/errors';
import { getToken } from '../../../../utils/get-token';
import { getActionRoute } from 'src/app/utils/voting-event-flow.util';
import { AppSessionService } from 'src/app/app-session.service';

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
    public appSession: AppSessionService
  ) {}

  ngAfterViewInit() {
    const _user$ = fromEvent(this.userid.nativeElement, 'keyup').pipe(map(() => this.userid.nativeElement.value));
    const _password$ = fromEvent(this.pwd.nativeElement, 'keyup').pipe(map(() => this.pwd.nativeElement.value));
    const _loginButtonClick$ = fromEvent(this.loginButtonRef.nativeElement, 'click');

    this.loginSubscription = this.logIn$(_user$, _password$, _loginButtonClick$).subscribe(
      (authResp) => {
        this.authService.isLoggedIn = authResp;
        const redirect = getActionRoute(this.appSession.getSelectedVotingEvent());
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

    this.inputData$ = combineLatest(this.user$, this.password$);
    this.isValidInputData$ = this.inputData$.pipe(
      map(([user, password]) => this.isInputDataValid(user, password)),
      share() // isValidInputData$ is subscribed in the template via asyc pipe - any other subscriber should use this subscription
    );

    this.clickOnLogin$ = combineLatest(this.isValidInputData$, this.inputData$).pipe(
      switchMap(([isValid, [user, password]]) => {
        if (isValid) {
          return loginButtonClick$.pipe(map(() => ({ user, password })));
        } else {
          return never();
        }
      })
    );

    let credentials;
    return this.clickOnLogin$.pipe(
      switchMap((_credentials) => {
        credentials = _credentials;
        return this.authService.login(credentials.user, credentials.password);
      }),
      catchError((err, caught) => {
        if (err.errorCode === ERRORS.serverUnreacheable) {
          return throwError(err.message);
        }
        if (err.message) {
          this.message$.next(err.message);
          return caught;
        }
      })
    );
  }

  isInputDataValid(user: string, password: string) {
    return user.trim().length > 0 && password.trim().length > 0;
  }
}
