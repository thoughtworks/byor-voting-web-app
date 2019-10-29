import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VotingEventService } from './voting-event.service';
import { BackendService } from './backend.service';

import { MockBackEndService } from 'src/app/modules/test-mocks/mock-back-end-service';
import { tap, switchMap, concatMap } from 'rxjs/operators';
import { Technology } from '../models/technology';

const QUADRANTS = ['tools', 'languages & frameworks', 'platforms', 'techniques'];
const TEST_TECHNOLOGIES = [
  {
    id: '0001',
    name: 'Babel',
    quadrant: QUADRANTS[0],
    isnew: true,
    description: 'Description of <strong>Babel</strong>'
  },
  {
    id: '0002',
    name: 'Ember.js',
    quadrant: QUADRANTS[1],
    isnew: true,
    description: 'Description of <strong>Ember.js</strong>'
  },
  {
    id: '0003',
    name: 'Docker',
    quadrant: QUADRANTS[2],
    isnew: false,
    description: 'Description of <strong>Docker</strong>'
  },
  {
    id: '0004',
    name: 'Consumer-driven contract testing',
    quadrant: QUADRANTS[3],
    isnew: true,
    description: 'Description of <strong>Consumer-driven contract testin</strong>'
  },
  {
    id: '0005',
    name: 'LambdaCD',
    quadrant: QUADRANTS[0],
    isnew: true,
    description: 'Description of <strong>LambdaCD</strong>'
  }
];

describe('VotingEventService - get VotingEvent', () => {
  const mockBackendService = new MockBackEndService();
  mockBackendService.techsForVotingEvent = TEST_TECHNOLOGIES.slice();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BackendService, useValue: mockBackendService }]
    });
  });

  it('should be created', () => {
    const service: VotingEventService = TestBed.get(VotingEventService);
    expect(service).toBeTruthy();
  });

  it('When a tecnology is added the new array of technologies is emitted', () => {
    const service: VotingEventService = TestBed.get(VotingEventService);
    let isVotingEventFetched = false;
    let areTechnologiesEmitted = false;
    let areQuadrantsEmitted = false;
    service
      .getVotingEvent$('a voting event id')
      .pipe(
        tap({
          next: (votingEvent) => {
            isVotingEventFetched = true;
            expect(votingEvent).toBeDefined();
          },
          error: (err) => {
            throw new Error(`should not encounter an error condition when executing getVotingEvent - error ${err}`);
          },
          complete: () => {
            expect(isVotingEventFetched).toBeTruthy();
          }
        }),
        switchMap(() => service.technologies$),
        tap({
          next: (technologies) => {
            areTechnologiesEmitted = true;
            expect(technologies.length).toEqual(TEST_TECHNOLOGIES.length);
            technologies.map((tech) => {
              expect(TEST_TECHNOLOGIES.filter((testTech) => testTech.name === tech.name).length).toEqual(1);
            });
          },
          error: (err) => {
            throw new Error(`should not encounter an error condition when subscribing to service.technologies$ - error ${err}`);
          },
          complete: () => {
            expect(areTechnologiesEmitted).toBeTruthy();
          }
        }),
        switchMap(() => service.quadrants$),
        tap({
          next: (quadrants) => {
            areQuadrantsEmitted = true;
            expect(quadrants.length).toEqual(QUADRANTS.length);
            quadrants.map((quadrant) => {
              expect(QUADRANTS.filter((testQuadrant) => testQuadrant.toUpperCase() === quadrant).length).toEqual(1);
            });
          },
          error: (err) => {
            throw new Error(`should not encounter an error condition when subscribing to service.quadrants$ - error ${err}`);
          },
          complete: () => {
            expect(areQuadrantsEmitted).toBeTruthy();
          }
        })
      )
      .subscribe();
  });
});

describe('VotingEventService - add technology to a voting event', () => {
  const mockBackendService = new MockBackEndService();
  mockBackendService.techsForVotingEvent = TEST_TECHNOLOGIES.slice();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BackendService, useValue: mockBackendService }]
    });
  });

  it('should emit the technologies and the quadrants once the voting eveny is fetched', () => {
    const service: VotingEventService = TestBed.get(VotingEventService);
    const votingEventId = 'a voting event id for new tech';
    const newTech: Technology = { name: 'the cool new tech', quadrant: QUADRANTS[0], description: 'very cool', isnew: true };

    let isNewTechnologyEmitted = false;
    let areTechnologiesEmitted = false;
    service
      .getVotingEvent$(votingEventId)
      .pipe(concatMap(() => service.addTechnologyToVotingEvent$('a voting event id for new tech', newTech)))
      .subscribe({ error: console.error });
    service.newTechnologyAdded$.pipe(
      tap({
        next: (technology) => {
          isNewTechnologyEmitted = true;
          expect(technology.name).toEqual(newTech.name);
        },
        error: (err) => {
          throw new Error(`should not encounter an error condition when subscribing to service.newTechnologyAdded$ - error ${err}`);
        },
        complete: () => {
          expect(isNewTechnologyEmitted).toBeTruthy();
        }
      })
    );
    service.technologies$.pipe(
      tap({
        next: (technologies) => {
          areTechnologiesEmitted = true;
          expect(technologies.length).toEqual(TEST_TECHNOLOGIES.length + 1);
        },
        error: (err) => {
          throw new Error(
            `should not encounter an error condition when subscribing to service.technologies$ and a new tech is added- error ${err}`
          );
        },
        complete: () => {
          expect(areTechnologiesEmitted).toBeTruthy();
        }
      })
    );
  });
});
