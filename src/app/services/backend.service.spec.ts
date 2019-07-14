import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { BackendService } from './backend.service';
import { of, forkJoin } from 'rxjs';
import { tap, switchMap, catchError, map, concatMap, delay } from 'rxjs/operators';

import { VoteCredentials } from '../models/vote-credentials';
import { ERRORS } from './errors';
import { VotingEvent } from '../models/voting-event';
import { Technology } from '../models/technology';
import { environment } from '../../environments/environment';
import { Vote } from '../models/vote';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { apiDomain } from '../app.module';
import { logError } from '../utils/utils';
import { Comment } from '../models/comment';
import { VotingEventFlow } from '../models/voting-event-flow';

describe('BackendService', () => {
  let testToken;
  let httpClient: HttpClient;

  function getTestToken() {
    return testToken;
  }

  function testJwtOptionsFactory() {
    return {
      tokenGetter: getTestToken,
      whitelistedDomains: apiDomain()
    };
  }

  const validUser = { user: 'abc', pwd: '123' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: testJwtOptionsFactory
          }
        })
      ],
      providers: [HttpClient]
    });
    inject([HttpClient], (service1: HttpClient) => {
      httpClient = service1;
    })();
  });

  it('should be created', () => {
    const service: BackendService = TestBed.get(BackendService);
    expect(service).toBeTruthy();
  });

  describe('2 BackendService - focused integration tests', () => {
    it('2.1 test the entire voting cycle', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'thisTestVotingEvent';
      const commentOnVote = 'it is crap';
      const votes1 = [
        { ring: 'adopt', technology: null },
        {
          ring: 'hold',
          technology: null,
          comment: { text: commentOnVote }
        }
      ];
      const credentials1: VoteCredentials = {
        voterId: { firstName: 'fv1', lastName: 'lv1' },
        votingEvent: null
      };
      const votes2 = [{ ring: 'adopt', technology: null }, { ring: 'trial', technology: null }];
      const credentials2: VoteCredentials = {
        voterId: { firstName: 'fv2', lastName: 'lv2' },
        votingEvent: null
      };
      const votes3 = [{ ring: 'trial', technology: null }];

      let votingEvent;
      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap((resp) => service.getVotingEvents({ all: true })), // first delete any votingEvent with the same name
          map((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          switchMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          switchMap(() => service.createVotingEvent(votingEventName)),
          switchMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            expect(vEvents.length).toBe(1);
            expect(vEvents[0].status).toBe('closed');
            votingEvent = vEvents[0];
            credentials1.votingEvent = votingEvent;
          }),
          switchMap(() => service.openVotingEvent(votingEvent._id)),
          switchMap(() => service.hasAlreadyVoted(credentials1)),
          tap((hasVoted) => {
            expect(hasVoted).toBeFalsy();
          }),
          switchMap(() => service.getVotingEvent(votingEvent._id)),
          tap((vEvent) => {
            expect(vEvent.status).toBe('open');
            votes1[0].technology = vEvent.technologies[0];
            votes1[1].technology = vEvent.technologies[1];
            votes2[0].technology = vEvent.technologies[0];
            votes2[1].technology = vEvent.technologies[1];
            credentials1.votingEvent = vEvent;
            credentials2.votingEvent = vEvent;
          }),
          switchMap(() => service.saveVote(votes1, credentials1)),
          switchMap(() => service.saveVote(votes2, credentials2)),
          switchMap(() => service.getVotes(votingEvent._id)),
          tap((votesFromBE) => {
            expect(votesFromBE.length).toBe(4);
            const votesWithNoRound = votesFromBE.filter((vote) => typeof vote.eventRound === 'undefined');
            expect(votesWithNoRound.length).toBe(0);
            expect(votesFromBE.filter((v) => v.comment).length).toBe(1);
            expect(votesFromBE.filter((v) => v.comment)[0].comment.text).toBe(commentOnVote);
          }),
          switchMap(() => service.hasAlreadyVoted(credentials1)),
          tap((hasVoted) => {
            expect(hasVoted).toBeTruthy();
          }),
          switchMap(() => service.getVoters(votingEvent)),
          tap((voters) => {
            expect(voters.length).toBe(2);
          }),
          switchMap(() => service.calculateBlips(votingEvent)),
          tap((blips) => {
            expect(blips.length).toBe(2);
            expect(blips.filter((b) => b.forRevote).length).toBe(1);
          }),
          switchMap(() => service.getVotingEvent(votingEvent._id)),
          tap((event) => {
            votingEvent = event;
            expect(event.blips.length).toBe(2);
            expect(event.technologies).toBeDefined();
            expect(event.technologies.filter((t) => t.forRevote).length).toBe(1);
          }),
          switchMap(() => service.saveVote(votes2, credentials2)),
          catchError((err) => {
            expect(err.errorCode).toBe(ERRORS.voteAlreadyPresent);
            return of(null);
          }),
          switchMap(() => service.openForRevote(votingEvent)),
          switchMap(() => service.getVotingEvent(votingEvent._id)),
          tap((vEvent: VotingEvent) => {
            expect(vEvent.openForRevote).toBe(true);
            expect(vEvent.hasTechnologiesForRevote).toBe(true);
            expect(vEvent.technologies.filter((t) => t.forRevote).length).toBe(1);
            votes3[0].technology = vEvent.technologies[1];
            credentials1.votingEvent = vEvent;
          }),
          switchMap(() => service.saveVote(votes3, credentials1)),
          switchMap(() => service.cancelVotingEvent(votingEvent._id)),
          switchMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            expect(votingEvents.filter((ve) => ve.name === votingEventName).length).toBe(0);
          })
        )
        .subscribe({
          error: (err) => {
            logError('2.1 test the entire voting cycle ' + err);
            throw new Error('the voting cycle does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });

  // describe('3 BackendService - get aggregated votes', () => {
  // it('3.1 test the vote aggregation logic', done => {
  //   const service: BackendService = TestBed.get(BackendService);
  //   const votingEventName = 'theAggregationVotingEvent';
  //   // there are 3 voters casting votes on 2 technologies, tech1 and tech2
  //   // tech1 has 2 adopt and 1 hold
  //   // tech2 has 1 hold and 2 assess
  //   const techName1 = 'tech1';
  //   const techName2 = 'tech2';
  //   const votes1 = [
  //     {ring: 'adopt', technology: {id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true}},
  //     {ring: 'hold', technology: {id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false}}
  //   ];
  //   const credentials1: VoteCredentials = {
  //     voterId: {firstName: 'fv1', lastName: 'lv1'},
  //     votingEvent: null
  //   };
  //   const votes2 = [
  //     {ring: 'adopt', technology: {id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true}},
  //     {ring: 'assess', technology: {id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false}}
  //   ];
  //   const credentials2: VoteCredentials = {
  //     voterId: {firstName: 'fv2', lastName: 'lv2'},
  //     votingEvent: null
  //   };
  //   const votes3 = [
  //     {ring: 'hold', technology: {id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true}},
  //     {ring: 'assess', technology: {id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false}}
  //   ];
  //   const credentials3: VoteCredentials = {
  //     voterId: {firstName: 'fv3', lastName: 'lv3'},
  //     votingEvent: null
  //   };
  //   let votingEvent;
  //   service.cancelVotingEvent(votingEventName, true)
  //   .pipe(
  //     switchMap(() => service.createVotingEvent(votingEventName)),
  //     switchMap(() => service.getVotingEvents()),
  //     tap(votingEvents => {
  //       votingEvent = votingEvents.find(ve => ve.name === votingEventName);
  //       credentials1.votingEvent = votingEvent;
  //       credentials2.votingEvent = votingEvent;
  //       credentials3.votingEvent = votingEvent;
  //     }),
  //     switchMap(() => service.openVotingEvent(votingEvent._id)),
  //     switchMap(() => service.saveVote(votes1, credentials1)),
  //     switchMap(() => service.saveVote(votes2, credentials2)),
  //     switchMap(() => service.saveVote(votes3, credentials3)),
  //     switchMap(() => service.getAggregatedVotes(votingEvent)),
  //   )
  //   .subscribe(
  //     aggregatesVotes => {
  //       expect(aggregatesVotes.length).toBe(4);
  //       const aggVotesTech1 = aggregatesVotes.filter(av => av.technology.name === techName1);
  //       expect(aggVotesTech1.length).toBe(2);
  //       expect(aggVotesTech1.find(av => av.count === 2).ring).toBe('adopt');
  //       expect(aggVotesTech1.find(av => av.count === 1).ring).toBe('hold');
  //       const aggVotesTech2 = aggregatesVotes.filter(av => av.technology.name === techName2);
  //       expect(aggVotesTech2.length).toBe(2);
  //       expect(aggVotesTech2.find(av => av.count === 2).ring).toBe('assess');
  //       expect(aggVotesTech2.find(av => av.count === 1).ring).toBe('hold');
  //     },
  //     err => {
  //       logError('3.1 test the vote aggregation logic', err);
  //       done();
  //       throw(new Error('the vote aggregation logic has some issues'));
  //     },
  //     () => done()
  //   );
  // }, 20000);
  // });

  // describe('4 BackendService - calculate blips', () => {
  //   let httpClient: HttpClient;

  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [HttpClientModule],
  //       providers: [HttpClient]
  //     });
  //     inject([HttpClient], (service1: HttpClient) => {
  //       httpClient = service1;
  //     })();
  //   });

  //   it('4.1 test the blip calculation logic', (done) => {
  //     const service: BackendService = TestBed.get(BackendService);
  //     const votingEventName = 'theCalculateBlipsEvent';
  //     // there are 3 voters casting votes on 2 technologies, tech1 and tech2
  //     // tech1 has 2 adopt and 1 hold
  //     // tech2 has 1 hold and 2 assess
  //     const techName1 = 'tech1';
  //     const techName2 = 'tech2';
  //     const votes1 = [
  //       { ring: 'adopt', technology: { id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true } },
  //       { ring: 'hold', technology: { id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false } }
  //     ];
  //     const credentials1: VoteCredentials = {
  //       voterId: { firstName: 'fv1', lastName: 'lv1' },
  //       votingEvent: null
  //     };
  //     const votes2 = [
  //       { ring: 'adopt', technology: { id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true } },
  //       { ring: 'assess', technology: { id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false } }
  //     ];
  //     const credentials2: VoteCredentials = {
  //       voterId: { firstName: 'fv2', lastName: 'lv2' },
  //       votingEvent: null
  //     };
  //     const votes3 = [
  //       { ring: 'hold', technology: { id: '1', name: techName1, description: 'desc1', quadrant: 'tools', isnew: true } },
  //       { ring: 'assess', technology: { id: '2', name: techName2, description: 'desc2', quadrant: 'platforms', isnew: false } }
  //     ];
  //     const credentials3: VoteCredentials = {
  //       voterId: { firstName: 'fv3', lastName: 'lv3' },
  //       votingEvent: null
  //     };

  //     let votingEvent;
  //     service
  //       .cancelVotingEvent(votingEventName, true)
  //       .pipe(
  //         switchMap(() => service.createVotingEvent(votingEventName)),
  //         switchMap(() => service.getVotingEvents()),
  //         tap((votingEvents) => {
  //           votingEvent = votingEvents.find((ve) => ve.name === votingEventName);
  //           credentials1.votingEvent = votingEvent;
  //           credentials2.votingEvent = votingEvent;
  //           credentials3.votingEvent = votingEvent;
  //         }),
  //         switchMap(() => service.openVotingEvent(votingEvent._id)),
  //         switchMap(() => service.saveVote(votes1, credentials1)),
  //         switchMap(() => service.saveVote(votes2, credentials2)),
  //         switchMap(() => service.saveVote(votes3, credentials3)),
  //         switchMap(() => service.calculateBlips(votingEvent))
  //       )
  //       .subscribe(
  //         (blips) => {
  //           expect(blips.length).toBe(2);
  //           const blipTech1 = blips.find((b) => b.name === techName1);
  //           expect(blipTech1).toBeDefined();
  //           expect(blipTech1.ring).toBe('adopt');
  //           const blipTech2 = blips.find((b) => b.name === techName2);
  //           expect(blipTech2).toBeDefined();
  //           expect(blipTech2.ring).toBe('assess');
  //         },
  //         (err) => {
  //           logError('4.1 test the blip calculation logic', err);
  //           done();
  //           throw new Error('the blip calculation logic has some issues');
  //         },
  //         () => done()
  //       );
  //   }, 20000);
  // });

  describe('5 BackendService - authenticate', () => {
    it(`5.1 authenticate a valid user. It assumes that the users used in the test are correctly loaded in the backend`, (done) => {
      const service: BackendService = TestBed.get(BackendService);
      service.authenticate(validUser.user, validUser.pwd).subscribe(
        (resp) => {
          expect(resp).toBeTruthy();
        },
        (err) => {
          logError('5.1 authenticate a valid user ' + err);
          throw new Error('the authenticate logic has some issues');
        },
        () => done()
      );
    }, 10000);

    it(`5.2 tries to authenticate a user with the wrong password. 
  It assumes that the users used in the test are correctly loaded in the backend`, (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const invalidUser = { user: 'abc', pwd: '321' };

      service.authenticate(invalidUser.user, invalidUser.pwd).subscribe(
        (resp) => {
          logError('5.2 authenticate a user with wrong password ' + resp);
          throw new Error('the authenticate logic has some issues');
        },
        (err) => {
          expect(err.errorCode).toBe(ERRORS.pwdInvalid);
          done();
        },
        () => done()
      );
    }, 10000);

    it(`5.3 tries to authenticate a user that does not exist. 
  It assumes that the users used in the test are correctly loaded in the backend`, (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const invalidUser = { user: 'not existing user', pwd: '321' };

      service.authenticate(invalidUser.user, invalidUser.pwd).subscribe(
        (resp) => {
          logError('5.3 authenticate a user that does not exist ' + resp);
          throw new Error('the authenticate logic has some issues');
        },
        (err) => {
          expect(err.errorCode).toBe(ERRORS.userUnknown);
          done();
        },
        () => done()
      );
    }, 10000);
  });

  describe('6 BackendService - getConfiguration', () => {
    it(`6.1 retrieve the configuration without specifying a user.
  It assumes that the configuration has been correctly loaded on the backend
  This can be achieved using the command node ./dist/src/mongodb/scripts/set-configuration-collection DEV`, (done) => {
      const service: BackendService = TestBed.get(BackendService);

      service.getConfiguration().subscribe(
        (configuration) => {
          expect(configuration.revoteToggle).toBeFalsy();
          expect(configuration.secondValue).toBe('second');
          expect(configuration.thirdValue).toBeUndefined();
        },
        (err) => {
          logError('6.1 retrieve the configuration without specifying a user ' + err);
          throw new Error('the getConfiguration logic has some issues');
        },
        () => done()
      );
    }, 10000);

    it(`6.2 retrieve the configuration specifying a user.
  It assumes that the configuration has been correctly loaded on the backend
  This can be achieved using the command node ./dist/src/mongodb/scripts/set-configuration-collection DEV`, (done) => {
      const service: BackendService = TestBed.get(BackendService);

      service.getConfiguration('abc').subscribe(
        (configuration) => {
          expect(configuration.revoteToggle).toBeTruthy();
          expect(configuration.secondValue).toBe('second');
          expect(configuration.thirdValue).toBe('third');
        },
        (err) => {
          logError('6.1 retrieve the configuration without specifying a user ' + err);
          throw new Error('the getConfiguration logic has some issues');
        },
        () => done()
      );
    }, 10000);
  });

  describe('7 BackendService - saveLogInfo', () => {
    it(`7.1 saves some info in the logCollection of the backend`, (done) => {
      const service: BackendService = TestBed.get(BackendService);

      const reason = 'I am the reason I send the log';
      const logData = 'I am something the client wants to log on the server';

      service.saveLogInfo(reason, logData).subscribe(
        (logId) => {
          expect(logId[0]).toBe('ObjectID');
        },
        (err) => {
          logError('7.1 saveLogInfo should not raise an error ' + err);
          throw new Error('the saveLogInfo logic has some issues');
        },
        () => done()
      );
    }, 10000);
  });

  describe('8 BackendService - crud on Technology', () => {
    it(`8.1 adds a technology, then reads it, then updates it`, (done) => {
      const service: BackendService = TestBed.get(BackendService);

      const technology: Technology = {
        name: 'the new tech to add',
        description: 'I am a tech that the client wants to add',
        isnew: true,
        quadrant: 'tools'
      };
      const newDescriptionForUpdate = 'this is the new description of the technology';

      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap((resp) => service.getTechnologies())
        )
        .pipe(
          map((technologies) => {
            const techs = technologies.filter((tech) => tech.name === technology.name);
            return techs.map((tech) => service.deleteTechnology(tech._id));
          }),
          switchMap((cancelTechRequests) => (cancelTechRequests.length > 0 ? forkJoin(cancelTechRequests) : of(null)))
        )
        .pipe(
          // add a technology
          switchMap(() => service.addTechnology(technology)),
          tap((data) => {
            expect(data).toBeDefined();
          }),
          // read the technology just added
          switchMap(() => service.getTechnology(technology.name)),
          tap((tech: Technology) => {
            expect(tech.description).toBe(technology.description);
          }),
          // update the technology just read
          switchMap((tech: Technology) => {
            const techForUpdate = tech;
            techForUpdate.description = newDescriptionForUpdate;
            return service.updateTechnology(techForUpdate);
          }),
          switchMap(() => service.getTechnology(technology.name)), // read again to see the effect of the update
          tap((tech: Technology) => {
            expect(tech.description).toBe(newDescriptionForUpdate);
          })
        )
        .subscribe({
          error: (err) => {
            logError('8.1 addTechnology should not raise an error ' + err);
            throw new Error('the addTechnology logic has some issues');
          },
          complete: () => done()
        });
    }, 10000);
  });

  describe('9 BackendService - test adding a technology to a voting event', () => {
    it('9.1 create a voting event and add a technology to it', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'theVotingEventForANewTech';

      const newTech: Technology = {
        name: 'the new tech to add',
        description: 'I am the cool new tech to add',
        isnew: true,
        quadrant: 'tools'
      };

      let votingEvent;
      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap((resp) => service.getVotingEvents({ all: true })),
          map((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          switchMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          switchMap(() => service.createVotingEvent(votingEventName)),
          switchMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            votingEvent = vEvents[0];
          }),
          switchMap(() => service.addTechnologyToVotingEvent(votingEvent._id, newTech)),
          switchMap(() => service.getVotingEvent(votingEvent._id)),
          tap((vEvent) => {
            expect(vEvent.technologies.length).toBe(1);
            expect(vEvent.technologies[0].description).toBe(newTech.description);
          })
        )
        .subscribe({
          error: (err) => {
            logError('9.1 test adding technology to an event ' + err);
            throw new Error('adding technology to an event does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });

  describe('10 BackendService - vote and then retrieve comments on the votes', () => {
    it('10.1 add some votes with comments and then retrieve the comments', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'a voting event with votes with comments';
      const commentOnVote1 = 'this is the FIRST comment I made for this test';
      const commentOnVote2 = 'this is the SECOND comment I made for this test';
      let votes1;
      let credentials1: VoteCredentials;
      let votes2;
      let credentials2: VoteCredentials;
      const votes3 = [{ ring: 'trial', technology: null }];

      let votingEvent;

      let tech1: Technology;
      let tech2: Technology;
      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap((resp) => service.getVotingEvents({ all: true })),
          map((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          switchMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          switchMap(() => service.createVotingEvent(votingEventName)),
          switchMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            expect(vEvents.length).toBe(1);
            credentials1 = {
              voterId: { firstName: 'fCommenter1', lastName: 'lCommenter1' },
              votingEvent: null
            };
            credentials2 = {
              voterId: { firstName: 'fCommenter2', lastName: 'fCommenter2' },
              votingEvent: null
            };
            votingEvent = vEvents[0];
            credentials1.votingEvent = votingEvent;
          }),
          switchMap(() => service.openVotingEvent(votingEvent._id)),
          switchMap(() => service.getVotingEvent(votingEvent._id)),
          // the first voter, Commenter1, saves 2 votes, the last one on tech2 with a comment
          // the second voter, Commenter2, saves 2 votes, the last one on the same technology with a comment
          tap((vEvent) => {
            tech1 = vEvent.technologies[0];
            tech2 = vEvent.technologies[1];
            votes1 = [
              { ring: 'adopt', technology: tech1 },
              {
                ring: 'hold',
                technology: tech2,
                comment: { text: commentOnVote1 }
              }
            ];
            votes2 = [
              { ring: 'adopt', technology: tech1 },
              {
                ring: 'trial',
                technology: tech2,
                comment: { text: commentOnVote2 }
              }
            ];
            credentials1.votingEvent = vEvent;
            credentials2.votingEvent = vEvent;
          }),
          switchMap(() => service.saveVote(votes1, credentials1)),
          switchMap(() => service.saveVote(votes2, credentials2)),
          switchMap(() => service.getVotesWithCommentsForTechAndEvent(tech2._id, votingEvent._id)),
          tap((votesWithComments: Vote[]) => {
            expect(votesWithComments.length).toBe(2);
            expect(votesWithComments.filter((v) => v.comment.text === commentOnVote1).length).toBe(1);
            expect(votesWithComments.filter((v) => v.comment.text === commentOnVote2).length).toBe(1);
          }),
          concatMap(() => service.getVotingEventWithNumberOfCommentsAndVotes(votingEvent._id)),
          tap((vEvent: VotingEvent) => {
            const techs = vEvent.technologies;
            const t1 = techs.find((t) => t.name === tech1.name);
            const t2 = techs.find((t) => t.name === tech2.name);
            expect(t1.numberOfVotes).toBe(2);
            expect(t1.numberOfComments).toBe(0);
            expect(t2.numberOfVotes).toBe(2);
            expect(t2.numberOfComments).toBe(2);
          })
        )
        .subscribe({
          error: (err) => {
            console.error('10.1 test the entire voting cycle', err);
            throw new Error('add and retrieve comments do not work');
          },
          complete: () => done()
        });
    }, 100000);
    it('10.2 add one vote with a comment, retrieve the vote and add a reply to the comment', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'a voting event with votes with comments and replies';
      const replyText = 'this is the REPLY to the comment';
      const replyAuthor = 'I am the author of the reply';
      let votes1: Vote[];
      let credentials1: VoteCredentials;

      let votingEvent;

      let tech1: Technology;

      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          concatMap(() => service.getVotingEvents({ all: true })), // first delete any votingEvent with the same name
          map((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          concatMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          concatMap(() => service.createVotingEvent(votingEventName)),
          concatMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            expect(vEvents.length).toBe(1);
            credentials1 = {
              voterId: { firstName: 'fReplied1', lastName: 'fReplied2' },
              votingEvent: null
            };
            votingEvent = vEvents[0];
            credentials1.votingEvent = votingEvent;
          }),
          concatMap(() => service.openVotingEvent(votingEvent._id)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          // the first voter, Commenter1, saves 1 vote with a comment
          tap((vEvent) => {
            tech1 = vEvent.technologies[0];
            votes1 = [{ ring: 'hold', technology: tech1, comment: { text: 'comment on the vote' } }];
            credentials1.votingEvent = vEvent;
          }),
          concatMap(() => service.saveVote(votes1, credentials1)),
          concatMap(() => service.getVotesWithCommentsForTechAndEvent(tech1._id, votingEvent._id)),
          concatMap((votes: Vote[]) => {
            const theVote = votes[0];
            const theCommentId = theVote.comment.id;
            const theReply: Comment = { text: replyText, author: replyAuthor };
            return service.addReplyToVoteComment(theVote._id, theReply, theCommentId);
          }),
          concatMap(() => service.getVotesWithCommentsForTechAndEvent(tech1._id, votingEvent._id)),
          tap((votes: Vote[]) => {
            const theVote = votes[0];
            expect(theVote.comment).toBeDefined();
            expect(theVote.comment.replies).toBeDefined();
            expect(theVote.comment.replies.length).toBe(1);
            expect(theVote.comment.replies[0].text).toBe(replyText);
          })
        )
        .subscribe({
          error: (err) => {
            console.error('10.2 test the entire voting cycle', err);
            throw new Error('add reply to a comment does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });

  describe('11 BackendService - add comments and replies to a Technology', () => {
    it('11.1 add a tech to a voting event and then add a comment to that technology and a reply to that comment', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'a voting event with a technology with one comment and one reply';

      let votingEvent: VotingEvent;

      const newTech: Technology = {
        name: 'the new tech to add for comments',
        description: 'I am the tech that receives comments',
        isnew: true,
        quadrant: 'tools'
      };
      const theComment = 'I am the comment';
      const theAuthorOfTheComment = 'I am the author of the comment';
      const theReplyToTheComment = 'I am the reply to the comment';
      const theAuthorOfTheReply = 'I am the author of the reply';

      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap(() => service.getVotingEvents({ all: true })),
          map((votingEvents: any) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          concatMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          concatMap(() => service.createVotingEvent(votingEventName)),
          concatMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            votingEvent = vEvents[0];
          }),
          concatMap(() => service.openVotingEvent(votingEvent._id)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          concatMap(() => service.addTechnologyToVotingEvent(votingEvent._id, newTech)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          map((vEvent) => vEvent.technologies.find((t) => t.description === newTech.description)),
          concatMap((tech: Technology) => service.addCommentToTech(votingEvent._id, tech._id, theComment, theAuthorOfTheComment)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          map((vEvent: VotingEvent) => vEvent.technologies.find((t) => t.description === newTech.description)),
          tap((tech: Technology) => {
            const techComments = tech.comments;
            expect(techComments).toBeDefined();
            expect(techComments.length).toBe(1);
            expect(techComments[0].text).toBe(theComment);
            expect(techComments[0].author).toBe(theAuthorOfTheComment);
            expect(techComments[0].id).toBeDefined();
            expect(techComments[0].timestamp).toBeDefined();
            expect(techComments[0].replies).toBeUndefined();
          }),
          concatMap((tech: Technology) => {
            const commentId = tech.comments[0].id;
            const reply: Comment = {
              text: theReplyToTheComment,
              author: theAuthorOfTheReply
            };
            return service.addReplyToTechComment(votingEvent._id, tech._id, reply, commentId);
          }),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          map((vEvent) => vEvent.technologies.find((t) => t.description === newTech.description)),
          tap((tech: Technology) => {
            const replies = tech.comments[0].replies;
            expect(replies).toBeDefined();
            expect(replies.length).toBe(1);
            expect(replies[0].text).toBe(theReplyToTheComment);
            expect(replies[0].author).toBe(theAuthorOfTheReply);
            expect(replies[0].id).toBeDefined();
            expect(replies[0].timestamp).toBeDefined();
            expect(replies[0].replies).toBeUndefined();
          })
        )
        .subscribe({
          error: (err) => {
            console.error('11.1 add a tech to a voting event', err);
            throw new Error('add a tech to a voting event does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });

  describe('12 BackendService - create a user, authenticate and then delete it', () => {
    it('12.1 create a user, authenticate and then delete it', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'a voting event for a user to log in';

      let votingEvent: VotingEvent;
      const user = 'A new user';
      const pwd = 'my password';
      const firstRole = 'architect';
      const secondRole = 'dev';
      const firstStepName = 'first step';
      const secondStepName = 'second step';
      const votingEventFlow: VotingEventFlow = {
        steps: [
          {
            name: firstStepName,
            identification: { name: 'nickname' },
            action: { name: 'vote', parameters: { commentOnVoteBlocked: false } }
          },
          {
            name: secondStepName,
            identification: { name: 'login', roles: [firstRole] },
            action: { name: 'conversation' }
          }
        ]
      };
      // at the moment the format is one object per role, and the name is repeated is the used has more than one role
      // this is to mimic an csv format
      const votingEventUser = [{ user, role: firstRole }, { user, role: secondRole }];

      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap(() => service.deleteUsers([user])),
          concatMap(() => service.getVotingEvents({ all: true })),
          map((votingEvents: any) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          concatMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          concatMap(() => service.createVotingEvent(votingEventName, votingEventFlow)),
          concatMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            votingEvent = vEvents[0];
          }),
          concatMap(() => service.addUsersWithRole(votingEventUser)),
          // authinticate first time
          concatMap(() => service.authenticateForVotingEvent(user, pwd, votingEvent._id, firstStepName)),
          tap((resp) => {
            expect(resp.token).toBeDefined();
            expect(resp.pwdInserted).toBeTruthy();
            expect(resp.token === testToken).toBeFalsy();
            testToken = resp.token;
          }),
          // authenticate secondtime
          concatMap(() => service.authenticateForVotingEvent(user, pwd, votingEvent._id, firstStepName)),
          tap((resp) => {
            expect(resp.token).toBeDefined();
            expect(resp.pwdInserted).toBeFalsy();
          }),
          // delete the user and then try to authenticate
          concatMap(() => service.deleteUsers([user])),
          concatMap(() => service.authenticateForVotingEvent(user, pwd, votingEvent._id, firstStepName)),
          catchError((err) => {
            expect(err.errorCode).toBe(ERRORS.userUnknown);
            return of(null);
          })
        )
        .subscribe({
          error: (err) => {
            console.error('12.1 create a user, authenticate and then delete it', err);
            throw new Error('create a user, authenticate and then delete logic does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });

  describe('13 BackendService - vote and then move to the next step', () => {
    it('13.1 add some votes and then move to the next step in the VotingEvent flow', (done) => {
      const service: BackendService = TestBed.get(BackendService);
      const votingEventName = 'a voting event to be moved to the next step';
      let votes1;
      let credentials1: VoteCredentials;
      let votes2;
      let credentials2: VoteCredentials;

      let votingEvent;

      let tech1: Technology;
      let tech2: Technology;
      const productionTag = 'Production';
      const trainingTag = 'Training';

      service
        .authenticate(validUser.user, validUser.pwd)
        .pipe(
          tap((resp) => (testToken = resp)),
          concatMap(() => service.getVotingEvents({ all: true })),
          map((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            return vEvents.map((ve) => service.cancelVotingEvent(ve._id, true));
          }),
          concatMap((cancelVERequests) => (cancelVERequests.length > 0 ? forkJoin(cancelVERequests) : of(null)))
        )
        .pipe(
          concatMap(() => service.createVotingEvent(votingEventName)),
          concatMap(() => service.getVotingEvents()),
          tap((votingEvents) => {
            const vEvents = votingEvents.filter((ve) => ve.name === votingEventName);
            expect(vEvents.length).toBe(1);
            credentials1 = {
              voterId: { firstName: 'fVoter1', lastName: 'lVoter1' },
              votingEvent: null
            };
            credentials2 = {
              voterId: { firstName: 'fVoter2', lastName: 'lVoter2' },
              votingEvent: null
            };
            votingEvent = vEvents[0];
            credentials1.votingEvent = votingEvent;
          }),
          concatMap(() => service.openVotingEvent(votingEvent._id)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          // the first voter, Voter1, saves 2 votes,
          // the second voter, Voter2, saves 2 votes,
          // tech1 gets 2 "adopt" while tech2 gets 1 "hold" and 1 "trial"
          // tech1 gets also 2 production tags and 1 training and tech2 gets 1 training tag
          tap((vEvent) => {
            tech1 = vEvent.technologies[0];
            tech2 = vEvent.technologies[1];
            votes1 = [
              { ring: 'adopt', technology: tech1, tags: [productionTag, trainingTag] },
              {
                ring: 'hold',
                technology: tech2
              }
            ];
            votes2 = [
              { ring: 'adopt', technology: tech1, tags: [productionTag] },
              {
                ring: 'trial',
                technology: tech2,
                tags: [trainingTag]
              }
            ];
            credentials1.votingEvent = vEvent;
            credentials2.votingEvent = vEvent;
          }),
          concatMap(() => service.saveVote(votes1, credentials1)),
          concatMap(() => service.saveVote(votes2, credentials2)),
          concatMap(() => service.moveToNexFlowStep(votingEvent._id)),
          concatMap(() => service.getVotingEvent(votingEvent._id)),
          tap((vEvent: VotingEvent) => {
            const techs = vEvent.technologies;
            const t1 = techs.find((t) => t.name === tech1.name);
            const t2 = techs.find((t) => t.name === tech2.name);
            expect(t1.votingResult).toBeDefined();
            expect(t1.votingResult.votesForRing).toBeDefined();
            expect(t1.votingResult.votesForRing.length).toBe(1);
            expect(t1.votingResult.votesForRing[0].count).toBe(2);
            expect(t1.votingResult.votesForRing[0].ring).toBe('adopt');
            expect(t1.votingResult.votesForTag).toBeDefined();
            expect(t1.votingResult.votesForTag.length).toBe(2);
            const prodTagRes1 = t1.votingResult.votesForTag.find((t) => t.tag === productionTag);
            const trainingTagRes1 = t1.votingResult.votesForTag.find((t) => t.tag === trainingTag);
            expect(prodTagRes1.count).toBe(2);
            expect(trainingTagRes1.count).toBe(1);

            expect(t2.votingResult).toBeDefined();
            expect(t2.votingResult.votesForRing).toBeDefined();
            expect(t2.votingResult.votesForRing.length).toBe(2);
            const holdRingRes2 = t2.votingResult.votesForRing.find((v) => v.ring === 'hold');
            const trialRingRes2 = t2.votingResult.votesForRing.find((v) => v.ring === 'trial');
            expect(holdRingRes2.count).toBe(1);
            expect(trialRingRes2.count).toBe(1);
            expect(t2.votingResult.votesForTag).toBeDefined();
            expect(t2.votingResult.votesForTag.length).toBe(1);
            const trainingTagRes2 = t2.votingResult.votesForTag.find((t) => t.tag === trainingTag);
            expect(trainingTagRes2.count).toBe(1);
          })
        )
        .subscribe({
          error: (err) => {
            console.error('13.1 test "add some votes and then move to the next step in the VotingEvent flow"', err);
            throw new Error('"add some votes and then move to the next step in the VotingEvent flow" does not work');
          },
          complete: () => done()
        });
    }, 100000);
  });
});

describe('redirect to radar page', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should create proper query params for getting all blips', function() {
    const service: BackendService = TestBed.get(BackendService);
    const windowOpenSpy = spyOn(window, 'open');
    service.url = 'service-url/';
    environment.radarURL = 'radar-url/';
    service.getBlipsForAllEvent({ siteName: 'site-name' });
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'radar-url/?title=site-name&sheetId=service-url%2Fvotes%2Fblips.csv%3FserviceUrl%3Dservice-url%2F%26radarUrl%3Dradar-url%2F%26type%3Dcsv',
      '_blank'
    );
  });

  it('should create title param with default sitename when site name not given in config', function() {
    const service: BackendService = TestBed.get(BackendService);
    const windowOpenSpy = spyOn(window, 'open');
    service.url = 'service-url/';
    environment.radarURL = 'radar-url/';
    service.getBlipsForAllEvent({});
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'radar-url/?title=BUILD YOUR OWN RADAR&sheetId=service-url%2Fvotes%2Fblips.csv%3FserviceUrl%3Dservice-url%2F%26radarUrl%3Dradar-url%2F%26type%3Dcsv',
      '_blank'
    );
  });

  it('should create proper query params for getting blips for event', function() {
    const service: BackendService = TestBed.get(BackendService);
    const windowOpenSpy = spyOn(window, 'open');
    service.url = 'service-url/';
    environment.radarURL = 'radar-url/';
    const votingEvent: VotingEvent = {
      _id: '54ee1f2d33335326d70987df',
      name: 'codemotion',
      status: 'open',
      round: 1,
      creationTS: '2019-02-14T14:08:10.410Z'
    };

    service.getBlipsForSelectedEvent(votingEvent, {
      siteName: 'site-name',
      thresholdForRevote: 10
    });
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'radar-url/?title=codemotion&subtitle=site-name&sheetId=service-url%2Fvotes%2F54ee1f2d33335326d70987df%2Fblips.csv%3FthresholdForRevote%3D10%26type%3Dcsv',
      '_blank'
    );
  });

  it('should create proper query params for getting blips for revote', function() {
    const service: BackendService = TestBed.get(BackendService);
    const windowOpenSpy = spyOn(window, 'open');
    service.url = 'service-url';
    environment.radarURL = 'radar-url/';
    const votingEvent: VotingEvent = {
      _id: '54ee1f2d33335326d70987df',
      name: 'codemotion',
      status: 'open',
      round: 1,
      creationTS: '2019-02-14T14:08:10.410Z'
    };
    service.techForRevote(votingEvent, {
      siteName: 'site-name',
      thresholdForRevote: 10
    });
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'radar-url/?title=codemotion&subtitle=site-name&sheetId=service-urlvotes%2F54ee1f2d33335326d70987df%2Frevote%2Fblips.csv%3FthresholdForRevote%3D10%26type%3Dcsv',
      '_blank'
    );
  });
});
