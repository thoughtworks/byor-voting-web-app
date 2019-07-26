import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { TechnologyListComponent } from './technology-list.component';
import { AppMaterialModule } from '../../../../app-material.module';
import { BackendService } from '../../../../services/backend.service';
import { AppSessionService } from 'src/app/app-session.service';
import { VoteService } from '../../../vote/services/vote.service';
import { TechnologyListService } from '../services/technology-list.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { MockVoteService, TEST_TECHNOLOGIES } from 'src/app/modules/test-mocks/mock-vote-service';
import { MockBackEndService } from 'src/app/modules/test-mocks/mock-back-end-service';

const mockBackendService = new MockBackEndService();
mockBackendService.techsForVotingEvent = TEST_TECHNOLOGIES;
class MockTechnologyListService {
  technologies$ = of(TEST_TECHNOLOGIES).pipe(observeOn(asyncScheduler));
}

describe('TechnologyListComponent', () => {
  let component: TechnologyListComponent;
  let fixture: ComponentFixture<TechnologyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: TechnologyListService, useClass: MockTechnologyListService }
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
  class MockStatefullTechnologyListService {
    technologies$ = of(TECHS).pipe(observeOn(asyncScheduler));
    newTechnologyAdded$ = new Subject<any>();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyListComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [
        { provide: BackendService, useClass: MockStatefullBackEndService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: TechnologyListService, useClass: MockStatefullTechnologyListService }
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
