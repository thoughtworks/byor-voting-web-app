import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from '../../../app-material.module';

import { VoteService } from '../services/vote.service';
import { VoteComponent } from './vote.component';
import { BackendService } from '../../../services/backend.service';
import { TwRings } from 'src/app/models/ring';
import { AppSessionService } from 'src/app/app-session.service';
import { TechnologyListModule } from '../../shared/technology-list/technology-list.module';
import { VotingEventService } from 'src/app/services/voting-event.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { MockVoteService, TEST_TECHNOLOGIES } from 'src/app/modules/test-mocks/mock-vote-service';
import { MockBackEndService } from 'src/app/modules/test-mocks/mock-back-end-service';
import { MockVotingEventService } from '../../test-mocks/mock-voting-event-service';

describe('VoteComponent', () => {
  const mockBackendService = new MockBackEndService();
  mockBackendService.techsForVotingEvent = TEST_TECHNOLOGIES;

  let component: VoteComponent;
  let fixture: ComponentFixture<VoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule, TechnologyListModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: VotingEventService, useClass: MockVotingEventService }
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

  it('1.5 does SELECT a technology which has been voted and then whose vote has been cancelled', () => {
    const ring = 'Hold';
    const technologyVotedIndex = 1;
    const vote = {
      ring,
      technology: TEST_TECHNOLOGIES[technologyVotedIndex]
    };

    component.addVote(vote);
    component.removeVote(vote);

    fixture.whenStable().then(() => {
      expect(component.techList.technologiesToShow.find((t) => t.name === vote.technology.name)).toBeDefined();
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
});

describe('vote exist', () => {
  const mockBackendService = new MockBackEndService();
  mockBackendService.techsForVotingEvent = TEST_TECHNOLOGIES;

  let component: VoteComponent;
  let fixture: ComponentFixture<VoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule, TechnologyListModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: VotingEventService, useClass: MockVotingEventService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
