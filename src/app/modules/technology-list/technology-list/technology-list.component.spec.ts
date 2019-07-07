import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { TechnologyListComponent } from './technology-list.component';
import { AppMaterialModule } from '../../../app-material.module';
import { BackendService } from '../../../services/backend.service';
import { AppSessionService } from 'src/app/app-session.service';
import { VotingEvent } from 'src/app/models/voting-event';
import { VoteService } from '../../vote/services/vote.service';
import { TechnologyListService } from '../services/technology-list.service';
import { Technology } from 'src/app/models/technology';

const TEST_TECHNOLOGIES = [
  {
    id: '0001',
    name: 'Babel',
    quadrant: 'Tools',
    isnew: true,
    description: 'Description of <strong>Babel</strong>'
  },
  {
    id: '0002',
    name: 'Ember.js',
    quadrant: 'Languages & Frameworks',
    isnew: true,
    description: 'Description of <strong>Ember.js</strong>'
  },
  {
    id: '0003',
    name: 'Docker',
    quadrant: 'Platforms',
    isnew: false,
    description: 'Description of <strong>Docker</strong>'
  },
  {
    id: '0004',
    name: 'Consumer-driven contract testing',
    quadrant: 'Techniques',
    isnew: true,
    description: 'Description of <strong>Consumer-driven contract testin</strong>'
  },
  {
    id: '0005',
    name: 'LambdaCD',
    quadrant: 'Tools',
    isnew: true,
    description: 'Description of <strong>LambdaCD</strong>'
  }
];
class MockBackEndService {
  getVotingEvent() {
    const votingEvent = {
      technologies: TEST_TECHNOLOGIES,
      name: null,
      status: 'closed',
      _id: null,
      creationTS: null,
      flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
    };
    return of(votingEvent).pipe(observeOn(asyncScheduler));
  }
  getVotingEventWithNumberOfCommentsAndVotes() {
    return of(null);
  }
}
class MockVoteService {
  credentials;

  constructor() {
    this.credentials = {
      voterId: null,
      votingEvent: { technologies: TEST_TECHNOLOGIES, name: null, status: 'closed', _id: null, creationTS: null }
    };
  }
}
class MockAppSessionService {
  private selectedVotingEvent: VotingEvent;

  constructor() {
    this.selectedVotingEvent = {
      _id: '123',
      name: 'an event',
      status: 'open',
      creationTS: 'abc',
      flow: {
        steps: [{ name: 'step 1', identification: { name: 'nickname' }, action: { name: 'vote' } }]
      }
    };
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }
  getSelectedTechnology() {
    return null;
  }
}

describe('TechnologyListComponent', () => {
  let component: TechnologyListComponent;
  let fixture: ComponentFixture<TechnologyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useClass: MockBackEndService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        TechnologyListService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('1.1 should select all the technologies emitted bythe BackEnd service since there are no filters applied', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.length).toBe(TEST_TECHNOLOGIES.length);
    });
  });

  it('1.2 should select just the technologies of the quadrant selected', () => {
    const quadrantSelected = 'Tools';

    component.quadrantSelected(quadrantSelected);
    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.length).toBe(TEST_TECHNOLOGIES.filter((d) => d.quadrant === quadrantSelected).length);
    });
  });

  it('1.3 selects all technologies since we select twice in a row the same quadrant and therefore the toggle logic is applied', () => {
    const quadrantSelected = 'Tools';

    component.quadrantSelected(quadrantSelected);
    component.quadrantSelected(quadrantSelected);

    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.length).toBe(TEST_TECHNOLOGIES.length);
    });
  });

  it('1.4 does not select a technology which has been defined as to be excluded', () => {
    const tech = TEST_TECHNOLOGIES[1];

    component.setTechnolgiesToExclude([tech]);
    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.find((t) => t.name === tech.name)).toBeUndefined();
    });
  });

  describe('search for technology', () => {
    it('should list down all the technologies that matches the search string', () => {
      component.search$ = of(TEST_TECHNOLOGIES[0].name);
      fixture.whenStable().then(() => {
        expect(component.technologiesToShow.find((t) => t === TEST_TECHNOLOGIES[0]));
      });
    });

    it('should list down all the technologies that matches the search character', () => {
      component.search$ = of('c');
      fixture.whenStable().then(() => {
        expect(component.technologiesToShow.length).toBe(3);
        expect(component.technologiesToShow).toContain(TEST_TECHNOLOGIES[2]);
        expect(component.technologiesToShow).toContain(TEST_TECHNOLOGIES[3]);
        expect(component.technologiesToShow).toContain(TEST_TECHNOLOGIES[4]);
      });
    });

    it('should get empty list of technologies when that does not matches the search string', () => {
      component.search$ = of('random');
      fixture.whenStable().then(() => {
        expect(component.technologiesToShow.length).toBe(0);
      });
    });
  });
});

describe('add a new technology', () => {
  const TECHS = [...TEST_TECHNOLOGIES];

  let component: TechnologyListComponent;
  let fixture: ComponentFixture<TechnologyListComponent>;
  class MockStatefullBackEndService {
    getVotingEvent() {
      const votingEvent = { technologies: TECHS, name: null, status: 'closed', _id: null, creationTS: null };
      return of(votingEvent).pipe(observeOn(asyncScheduler));
    }
    addTechnologyToVotingEvent(votingEventId: any, technology: any) {
      TECHS.push(technology);
      return of(technology).pipe(observeOn(asyncScheduler));
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useClass: MockStatefullBackEndService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        TechnologyListService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get empty list of technologies when that does not matches the search string', () => {
    const newTechName = 'The brand new tech';
    const theQuadrant = 'tools';
    component.createNewTechnology(newTechName, theQuadrant);
    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.find((t) => t.name === newTechName)).toBeDefined();
      expect(component.technologiesToShow.find((t) => t.name === newTechName).quadrant).toBe(theQuadrant);
    });
  });
});

describe('The voting event flow is in a step where it requires to read number of votes and comments for each tech', () => {
  const numberOfVotes = 1;
  const numberOfComments = 2;
  const TEST_TECHNOLOGIES_WITH_NUMBER_OF_VOTES_AND_COMMENTS: Technology[] = [
    {
      id: '0001',
      name: 'Babel',
      quadrant: 'Tools',
      isnew: true,
      description: 'Description of <strong>Babel</strong>',
      numberOfVotes,
      numberOfComments
    }
  ];

  let component: TechnologyListComponent;
  let fixture: ComponentFixture<TechnologyListComponent>;

  class MockBackEndServiceForNumberOfVotesAndComments {
    getVotingEvent() {
      return of(null).pipe(observeOn(asyncScheduler));
    }
    getVotingEventWithNumberOfCommentsAndVotes() {
      const votingEvent = {
        technologies: TEST_TECHNOLOGIES_WITH_NUMBER_OF_VOTES_AND_COMMENTS,
        name: null,
        status: 'closed',
        _id: null,
        creationTS: null,
        flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
      };
      return of(votingEvent).pipe(observeOn(asyncScheduler));
    }
  }
  class MockAppSessionServiceForVotingEventInStep2 {
    private selectedVotingEvent: VotingEvent;

    constructor() {
      this.selectedVotingEvent = {
        _id: '123',
        name: 'an event',
        status: 'open',
        creationTS: 'abc',
        round: 2,
        flow: {
          steps: [
            { name: 'step 1', identification: { name: 'nickname' }, action: { name: 'vote' } },
            {
              name: 'step 2',
              identification: { name: 'nickname' },
              action: { name: 'conversation', parameters: { displayVotesAndCommentNumbers: true } }
            }
          ]
        }
      };
    }

    getSelectedVotingEvent() {
      return this.selectedVotingEvent;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useClass: MockBackEndServiceForNumberOfVotesAndComments },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionServiceForVotingEventInStep2 },
        TechnologyListService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('2.1 if the flow step requires to read technologies with number of votes and comments it calls the right API', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      if (component.technologiesToShow.length !== TEST_TECHNOLOGIES_WITH_NUMBER_OF_VOTES_AND_COMMENTS.length) {
        throw new Error('technologiesToShow are not as expected');
      }
      expect(component.technologiesToShow.length === TEST_TECHNOLOGIES_WITH_NUMBER_OF_VOTES_AND_COMMENTS.length).toBeTruthy();
      expect(component.technologiesToShow[0].numberOfComments).toBe(numberOfComments);
      expect(component.technologiesToShow[0].numberOfVotes).toBe(numberOfVotes);
    });
  });
});
