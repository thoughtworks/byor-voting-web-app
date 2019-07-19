import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RecommendationComponent } from './recommendation.component';
import { VoteService } from '../../vote/services/vote.service';
import { AppMaterialModule } from 'src/app/app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentTreesModule } from '../../shared/comment-trees/comment-trees.module';
import { AppSessionService } from 'src/app/app-session.service';
import { TechnologyVotingResultsModule } from '../../shared/technology-voting-results/technology-voting-results.module';
import { RecommendationCardComponent } from '../recommendation-card/recommendation-card.component';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';

describe('RecommendationComponent', () => {
  let component: RecommendationComponent;
  let fixture: ComponentFixture<RecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendationComponent, RecommendationCardComponent],
      imports: [
        BrowserAnimationsModule,
        AppMaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        CommentTreesModule,
        TechnologyVotingResultsModule
      ],
      providers: [VoteService, { provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
