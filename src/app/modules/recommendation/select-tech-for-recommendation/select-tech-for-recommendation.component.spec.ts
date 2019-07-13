import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppMaterialModule } from 'src/app/app-material.module';

import { VoteService } from '../../vote/services/vote.service';
import { TechnologyListService } from '../../shared/technology-list/services/technology-list.service';
import { TechnologyListComponent } from '../../shared/technology-list/technology-list/technology-list.component';

import { SelectTechForRecommendationComponent } from './select-tech-for-recommendation.component';
import { VotingEvent } from 'src/app/models/voting-event';
import { AppSessionService } from 'src/app/app-session.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { MockVoteService } from 'src/app/modules/test-mocks/mock-vote-service';

describe('SelectTechForRecommendationComponent', () => {
  let component: SelectTechForRecommendationComponent;
  let fixture: ComponentFixture<SelectTechForRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTechForRecommendationComponent, TechnologyListComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, AppMaterialModule],
      providers: [
        { provide: VoteService, useClass: MockVoteService },
        TechnologyListService,
        { provide: AppSessionService, useClass: MockAppSessionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTechForRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});