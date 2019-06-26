import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, asyncScheduler } from 'rxjs';
import { tap, observeOn } from 'rxjs/operators';
import { marbles } from 'rxjs-marbles/jasmine';
import { AppMaterialModule } from '../../../app-material.module';
import { StartVotingSessionComponent } from './start-voting-session.component';
import { VoteService } from '../services/vote.service';
import { VotingEvent } from 'src/app/models/voting-event';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { logError } from 'src/app/utils/utils';

describe('StartVotingSessionComponent', () => {
  let fixture: ComponentFixture<StartVotingSessionComponent>;
  let component: StartVotingSessionComponent;
  let compiled: HTMLElement;

  let TEST_VOTING_EVENTS;
  beforeEach(async(() => {
    const voteServiceSpy: jasmine.SpyObj<VoteService> = jasmine.createSpyObj('VoteService', [
      'getVotingEvents',
      'hasVotedForEvent',
      'setVoter',
      'setSelectedEvent'
    ]);
    voteServiceSpy.getVotingEvents.and.callFake(() => {
      // need to make it async to avoid error 'ExpressionChangedAfterItHasBeenCheckedError'
      return of(TEST_VOTING_EVENTS).pipe(observeOn(asyncScheduler));
    });
    voteServiceSpy.hasVotedForEvent.and.returnValue(of(false));
    const configurationServiceSpy: jasmine.SpyObj<ConfigurationService> = jasmine.createSpyObj('ConfigurationService', [
      'defaultConfiguration'
    ]);
    configurationServiceSpy.defaultConfiguration.and.returnValue(
      of({
        bannerImageUrl: 'https://picsum.photos/id/427/200/300',
        bannerTargetUrl: 'https://www.lipsum.com/'
      })
    );
    TestBed.configureTestingModule({
      declarations: [StartVotingSessionComponent],
      imports: [RouterTestingModule, AppMaterialModule, HttpClientModule, BrowserAnimationsModule],
      providers: [{ provide: VoteService, useValue: voteServiceSpy }, { provide: ConfigurationService, useValue: configurationServiceSpy }]
    }).compileComponents();
  }));

  describe('1 - One open event', () => {
    beforeEach(() => {
      const anOpenEvent = { name: 'Event 1', status: 'open', creationTS: 'yesterday' } as VotingEvent;
      const aClosedEvent = { name: 'Event 2', status: 'closed', creationTS: 'today' } as VotingEvent;
      TEST_VOTING_EVENTS = [anOpenEvent, aClosedEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('0.0 - should create', () => {
      expect(component).toBeTruthy();
    });

    it('1.0 - open events', (done) => {
      // if test fails with a timeout exception it means that the Observable has never emitted
      component.openVotingEvents$.subscribe(
        (openEvents: any) => {
          expect(openEvents.length).toBe(1);
          done();
        },
        (err) => {
          logError(err);
          done.fail('Should not generate an error');
        }
      );
    });
    it('1.2 - there is just one open event', () => {
      component.moreThanOneOpenEvent$
        .pipe(
          tap(() => {
            fail('should not notify since there is only one open event');
          })
        )
        .subscribe();
    });
    it('1.3 - the voting event is notified since there is just one open event', (done) => {
      // if test fails with a timeout exception it means that the Observable has never emitted
      let counter = 0;
      component.votingEvent$.subscribe(
        (openEvent) => {
          counter++;
          expect(openEvent.name).toBe(TEST_VOTING_EVENTS[0].name);
          expect(counter).toBe(1);
          done();
        },
        (err) => {
          logError(err);
          done.fail('Should not generate an error');
        }
      );
    });
    it('1.4 - no messages are notified if there are open events', () => {
      component.message$
        .pipe(
          tap(() => {
            fail('should not emit any message');
          })
        )
        .subscribe();
    });
    it('1.6 - input data is not complete and valid since the first name is empty', (done) => {
      // if test fails with a timeout exception it means that the Observable has never emitted
      const firstName = '';
      const lastName = 'Last';
      const inputFirstName = fixture.nativeElement.querySelector('#firstName');
      const inputLastName = fixture.nativeElement.querySelector('#lastName');
      inputFirstName.value = firstName;
      inputLastName.value = lastName;
      component.isValidInputData$.subscribe(
        (isValid) => {
          // @todo not clear why the expect does not really trigger an error if the Observable emits 'true'
          expect(isValid).toBeFalsy();
          if (isValid) {
            logError('1.6 - input data is not complete and valid since the first name is empty Expected to be not valid');
            done.fail('Expected to be not valid');
          }
          done();
        },
        (err) => {
          logError(err);
          done.fail('Should not generate an error');
        }
      );

      inputFirstName.dispatchEvent(new KeyboardEvent('keyup', { key: 'y' }));
      inputLastName.dispatchEvent(new KeyboardEvent('keyup', { key: 'y' }));
    });
  });

  describe('2 - More than one open event', () => {
    beforeEach(() => {
      const oneOpenEvent = { name: 'Event 1', status: 'open', creationTS: 'yesterday' } as VotingEvent;
      const aSecondOpenEvent = { name: 'Event 2', status: 'open', creationTS: 'today' } as VotingEvent;
      TEST_VOTING_EVENTS = [oneOpenEvent, aSecondOpenEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('2.0 - open events', (done) => {
      // if test fails with a timeout exception it means that the Observable has never emitted
      component.openVotingEvents$.subscribe(
        (openEvents) => {
          expect(openEvents.length).toBe(2);
          done();
        },
        (err) => {
          logError(err);
          done.fail('Should not generate an error');
        }
      );
    });
    it('2.2 - moreThanOneOpenEvent$ does notify since there are more than 1 event open', (done) => {
      // if test fails with a timeout exception it means that the Observable has never emitted
      let counter = 0;
      component.moreThanOneOpenEvent$.subscribe(
        (openEvents) => {
          counter++;
          expect(openEvents[0].name).toBe(TEST_VOTING_EVENTS[0].name);
          expect(counter).toBe(1);
          done();
        },
        (err) => {
          logError(err);
          fail('Should not generate an error');
        }
      );
    });
    it('2.3 - the voting event is NOT notified since there are more than one open event', () => {
      component.votingEvent$
        .pipe(
          tap(() => {
            fail('should not notify since there there are 2 open event and no event has yet been chosen');
          })
        )
        .subscribe();
    });
    it('2.4 - no messages are notified if there are open events', () => {
      component.message$
        .pipe(
          tap(() => {
            fail('should not emit any message');
          })
        )
        .subscribe();
    });
  });

  describe('3 - No open event', () => {
    beforeEach(() => {
      const aClosedEvent = { name: 'Event 1', status: 'closed', creationTS: 'yesterday' } as VotingEvent;
      const anotherClosedEvent = { name: 'Event 2', status: 'closed', creationTS: 'today' } as VotingEvent;
      TEST_VOTING_EVENTS = [aClosedEvent, anotherClosedEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('3.1 - messages are notified if there are NO open events', (done) => {
      component.message$.subscribe(
        (message) => {
          expect(message).toBeTruthy();
          done();
        },
        (err) => {
          logError(err);
          done.fail('Should not generate an error');
        }
      );
    });
  });

  describe('4 - Test goToVote$ Observable pipe when just one open event is notified - uses marble test', () => {
    beforeEach(() => {
      const anOpenEvent = { name: 'Event 1', status: 'open', creationTS: 'yesterday' } as VotingEvent;
      const aClosedEvent = { name: 'Event 2', status: 'closed', creationTS: 'today' } as VotingEvent;
      TEST_VOTING_EVENTS = [anOpenEvent, aClosedEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it(
      '4.1 - test the goToVote$ Observable pipe when just one open event is notified',
      marbles((m) => {
        const theFirstName = 'first';
        const theLastName = 'LAST';

        const firstName = {
          a: theFirstName.substr(0, 1),
          b: theFirstName.substr(0, 2),
          c: theFirstName.substr(0, 3),
          d: theFirstName.substr(0, 4),
          e: theFirstName.substr(0, 5)
        };
        const lastName = {
          x: theLastName.substr(0, 1),
          y: theLastName.substr(0, 2),
          w: theLastName.substr(0, 3),
          z: theLastName.substr(0, 4)
        };
        const startButtonClick = {
          c: {}
        };
        const output = {
          o: {
            voterId: {
              firstName: theFirstName,
              lastName: theLastName
            },
            votingEvent: TEST_VOTING_EVENTS[0]
          }
        };

        const eventSelectionChanged$ = m.hot('---------------------------');
        const firstName$ = m.hot('^--a-b-c-d--e--------------', firstName);
        const lastName$ = m.hot('^---------------x-y-z------', lastName);
        const startButtonClick$ = m.hot('^-----------------------c--', startButtonClick);
        const expected = m.cold('------------------------o--', output);

        const destination = component.goToVote$(eventSelectionChanged$, firstName$, lastName$, startButtonClick$);

        m.expect(destination).toBeObservable(expected);
      })
    );
  });

  describe('5 - Test goToVote$ Observable pipe when MORE than one open event is notified - uses marble test', () => {
    beforeEach(() => {
      const anOpenEvent = { name: 'Event 1', status: 'closed', creationTS: 'yesterday' } as VotingEvent;
      const aClosedEvent = { name: 'Event 2', status: 'closed', creationTS: 'today' } as VotingEvent;
      const aSecondOpenEvent = { name: 'Event 2', status: 'open', creationTS: 'today' } as VotingEvent;
      TEST_VOTING_EVENTS = [anOpenEvent, aClosedEvent, aSecondOpenEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it(
      '5.1 - test the goToVote$ Observable pipe when MORE than one open event is notified',
      marbles((m) => {
        const theFirstName = 'first';
        const theLastName = 'LAST';

        const eventSelectionChanged = {
          e: TEST_VOTING_EVENTS[2]
        };
        const firstName = {
          a: theFirstName.substr(0, 1),
          b: theFirstName.substr(0, 2),
          c: theFirstName.substr(0, 3),
          d: theFirstName.substr(0, 4),
          e: theFirstName.substr(0, 5)
        };
        const lastName = {
          x: theLastName.substr(0, 1),
          y: theLastName.substr(0, 2),
          w: theLastName.substr(0, 3),
          z: theLastName.substr(0, 4)
        };
        const startButtonClick = {
          c: {}
        };
        const output = {
          o: {
            voterId: {
              firstName: theFirstName,
              lastName: theLastName
            },
            votingEvent: TEST_VOTING_EVENTS[2]
          }
        };

        const eventSelectionChanged$ = m.hot('^e-------------------------', eventSelectionChanged);
        const firstName$ = m.hot('^--a-b-c-d--e--------------', firstName);
        const lastName$ = m.hot('^---------------x-y-z------', lastName);
        const startButtonClick$ = m.hot('^-----------------------c--', startButtonClick);
        const expected = m.cold('------------------------o--', output);

        const destination = component.goToVote$(eventSelectionChanged$, firstName$, lastName$, startButtonClick$);

        m.expect(destination).toBeObservable(expected);
      })
    );
  });

  describe('6 - Banner', () => {
    beforeEach(() => {
      const anOpenEvent = { name: 'Event 1', status: 'open', creationTS: 'yesterday' } as VotingEvent;
      TEST_VOTING_EVENTS = [anOpenEvent];
      fixture = TestBed.createComponent(StartVotingSessionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should render the title received from configurations', () => {
      const bannerEl = compiled.querySelector('.banner-section');
      const bannerLinkEl = bannerEl.querySelector('a');
      const bannerImageEl = bannerLinkEl.querySelector('img');
      expect(bannerLinkEl.href).toEqual('https://www.lipsum.com/');
      expect(bannerImageEl.src).toEqual('https://picsum.photos/id/427/200/300');
    });
  });
});
