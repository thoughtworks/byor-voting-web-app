import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject, fromEvent, combineLatest, never, Subscription, merge, throwError } from 'rxjs';
import { map, share, switchMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ERRORS } from 'src/app/services/errors';
import { getToken } from '../../../utils/get-token';
import { AppSessionService } from 'src/app/app-session.service';

// The impleentation of this component is an experiment to implement all the logic of a Component using a single Observable chain,
// i.e. using a single subscription.
// The component is stateless. Its propoerties are all Observables.
// The entire logic, including validations and enablement/disablent of the submit button is done via observables.
// In the component typescript code there is only one subscription which fires everything.
// Other subscriptions are embedded in the html template via the async pipe.
// Again, this is an experiment. It is not meant to be the suggested way to code Components.

@Component({
  selector: 'byor-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  user$: Observable<string>;
  password$: Observable<string>;
  inputData$: Observable<any>;
  isValidInputData$: Observable<boolean>;
  clickOnLogin$: Observable<{ user: string; password: string }>;
  message$: Observable<string>;
  _message$ = new Subject<string>();

  loginSubscription: Subscription;

  @ViewChild('userid') userid: ElementRef;
  @ViewChild('pwd') pwd: ElementRef;
  @ViewChild('loginButton', { read: ElementRef }) loginButtonRef: ElementRef;

  constructor(
    public authService: AuthService,
    public router: Router,
    public errorService: ErrorService,
    private appSession: AppSessionService
  ) {}

  ngOnInit() {
    if (getToken()) {
      this.router.navigate(['admin']);
    }
    this.message$ = merge(this._message$, this.authService.message$);
  }

  ngAfterViewInit() {
    const _user$ = fromEvent(this.userid.nativeElement, 'keyup').pipe(map(() => this.userid.nativeElement.value));
    const _password$ = fromEvent(this.pwd.nativeElement, 'keyup').pipe(map(() => this.pwd.nativeElement.value));
    const _loginButtonClick$ = fromEvent(this.loginButtonRef.nativeElement, 'click');

    this.loginSubscription = this.logIn$(_user$, _password$, _loginButtonClick$).subscribe(
      (authResp) => {
        this.authService.isLoggedIn = authResp;
        const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
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
        return this.authService.login(credentials.user, credentials.password).pipe(
          tap(() => {
            this.appSession.setCredentials({ userId: credentials.user });
          })
        );
      }),
      catchError((err, caught) => {
        if (err.errorCode === ERRORS.serverUnreacheable) {
          return throwError(err.message);
        }
        if (err.message) {
          this._message$.next(err.message);
          return caught;
        }
      })
    );
  }

  isInputDataValid(user: string, password: string) {
    return user.trim().length > 0 && password.trim().length > 0;
  }
}
