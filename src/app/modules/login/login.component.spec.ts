import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError, Subject } from 'rxjs';

import { marbles } from 'rxjs-marbles/jasmine';

import { AppMaterialModule } from '../../app-material.module';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
  const validUserId = 'user';
  const validPwd = 'pwd';

  const userNotValidMsg = 'user not right';
  const pwdNotValidMsg = 'pwd not right';
  class MockAuthService {
    message$ = new Subject<string>();
    login(user: string, pwd: string) {
      if (user === validUserId && pwd === validPwd) {
        return of(true);
      } else if (user !== validUserId) {
        return throwError({ message: userNotValidMsg });
      } else {
        return throwError({ message: pwdNotValidMsg });
      }
    }
  }

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, AppMaterialModule, RouterTestingModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    '1.1 - test the login Obaservable pipe when the user and password are right - uses marble test',
    marbles((m) => {
      const userId = {
        a: 'u',
        b: 'us',
        c: 'use',
        d: 'user'
      };
      const pwd = {
        x: 'p',
        y: 'pw',
        z: 'pwd'
      };
      const loginClick = {
        c: {}
      };
      const output = {
        o: true
      };
      const userId$ = m.hot('^--a-b-c-d------------', userId);
      const pwd$ = m.hot('^----------x-y-z------', pwd);
      const loginButtonClick$ = m.hot('^------------------c--', pwd);
      const expected = m.cold('-------------------o--', output);

      const destination = component.logIn$(userId$, pwd$, loginButtonClick$);

      m.expect(destination).toBeObservable(expected);
    })
  );

  it(
    '1.2 - test the login Obaservable pipe when the user NOT right - uses marble test',
    marbles((m) => {
      const userId = {
        a: 'u',
        b: 'us',
        c: 'uss',
        d: 'usss'
      };
      const pwd = {
        x: 'p',
        y: 'pw',
        z: 'pwd'
      };
      const loginClick = {
        c: {}
      };
      const output = {
        o: false
      };
      const userId$ = m.hot('^--a-b-c-d------------', userId);
      const pwd$ = m.hot('^----------x-y-z------', pwd);
      const loginButtonClick$ = m.hot('^------------------c--', pwd);
      const expected = m.cold('----------------------', output);

      const destination = component.logIn$(userId$, pwd$, loginButtonClick$);

      m.expect(destination).toBeObservable(expected);

      component.message$.subscribe((message) => {
        expect(message).toBe(userNotValidMsg);
      });
    })
  );

  it(
    '1.3 - test the login Obaservable pipe when the password is NOT right - uses marble test',
    marbles((m) => {
      const userId = {
        a: 'u',
        b: 'us',
        c: 'use',
        d: 'user'
      };
      const pwd = {
        x: 'p',
        y: 'pp',
        z: 'ppp'
      };
      const loginClick = {
        c: {}
      };
      const output = {
        o: false
      };
      const userId$ = m.hot('^--a-b-c-d------------', userId);
      const pwd$ = m.hot('^----------x-y-z------', pwd);
      const loginButtonClick$ = m.hot('^------------------c--', pwd);
      const expected = m.cold('----------------------', output);

      const destination = component.logIn$(userId$, pwd$, loginButtonClick$);

      m.expect(destination).toBeObservable(expected);

      component.message$.subscribe((message) => {
        expect(message).toBe(pwdNotValidMsg);
      });
    })
  );
});
