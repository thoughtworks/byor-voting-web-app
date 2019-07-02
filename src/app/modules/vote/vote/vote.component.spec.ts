import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { AppMaterialModule } from '../../../app-material.module';

import { VoteService } from '../services/vote.service';
import { VoteComponent } from './vote.component';
import { BackendService } from '../../../services/backend.service';
import { TwRings } from 'src/app/models/ring';
import { AppSessionService } from 'src/app/app-session.service';
import { VotingEvent } from 'src/app/models/voting-event';

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
    const votingEvent = { technologies: TEST_TECHNOLOGIES, name: null, status: 'closed', _id: null, creationTS: null };
    return of(votingEvent).pipe(observeOn(asyncScheduler));
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
    this.selectedVotingEvent = { _id: '123', name: 'an event', status: 'open', creationTS: 'abc' };
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }
  getSelectedTechnology() {
    return null;
  }
}

describe('VoteComponent', () => {
  let component: VoteComponent;
  let fixture: ComponentFixture<VoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useClass: MockBackEndService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1.0 should create', () => {
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

  it('1.4 does not select a technology which has been voted', () => {
    const ring = 'hold';
    const technologyVotedIndex = 1;
    const vote = {
      ring,
      technology: TEST_TECHNOLOGIES[technologyVotedIndex]
    };

    component.addVote(vote);
    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.find((t) => t.name === vote.technology.name)).toBeUndefined();
    });
  });

  it('1.5 does SELECT a technology which has been voted and then whose vote has been cancelled', () => {
    const ring = 'hold';
    const technologyVotedIndex = 1;
    const vote = {
      ring,
      technology: TEST_TECHNOLOGIES[technologyVotedIndex]
    };

    component.addVote(vote);
    component.removeVote(vote);

    fixture.whenStable().then(() => {
      expect(component.technologiesToShow.find((t) => t.name === vote.technology.name)).toBeDefined();
    });
  });

  it('1.6 should give the list of votes filtered by ring', () => {
    expect(component.getVotesByRing(TwRings.names[0]).length).toBe(0);

    const firstVote = {
      ring: TwRings.names[0],
      technology: TEST_TECHNOLOGIES[0]
    };
    component.addVote(firstVote);

    expect(component.getVotesByRing(TwRings.names[0])).toEqual([firstVote]);

    const secondVote = {
      ring: TwRings.names[1],
      technology: TEST_TECHNOLOGIES[1]
    };
    component.addVote(secondVote);
    const thirdVote = {
      ring: TwRings.names[1],
      technology: TEST_TECHNOLOGIES[2]
    };
    component.addVote(thirdVote);

    expect(component.getVotesByRing(TwRings.names[0])).toEqual([firstVote]);
    expect(component.getVotesByRing(TwRings.names[1])).toEqual([secondVote, thirdVote]);
    expect(component.getVotesByRing(TwRings.names[2]).length).toEqual(0);
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

  describe('vote exist', () => {
    it('should return true when vote is already added', function() {
      const ring = 'hold';
      const technologyVotedIndex = 1;
      const vote = {
        ring,
        technology: TEST_TECHNOLOGIES[technologyVotedIndex]
      };

      component.addVote(vote);

      const isExist = component.isAlreadyVoted(TEST_TECHNOLOGIES[technologyVotedIndex].name);
      expect(isExist).toBeTruthy();
    });

    it('should return false when vote does not find in the voted list', function() {
      const ring = 'hold';
      const technologyVotedIndex = 1;
      const vote = {
        ring,
        technology: TEST_TECHNOLOGIES[technologyVotedIndex]
      };
      component.addVote(vote);
      const isExist = component.isAlreadyVoted('random');
      expect(isExist).toBeFalsy();
    });
  });
});
