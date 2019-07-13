import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppMaterialModule } from 'src/app/app-material.module';

import { ConversationComponent } from './conversation.component';
import { CommentTreesModule } from '../../shared/comment-trees/comment-trees.module';
import { MatTreeModule } from '@angular/material/tree';
import { AppSessionService } from 'src/app/app-session.service';
import { Technology } from 'src/app/models/technology';
import { VotingEvent } from 'src/app/models/voting-event';

const TEST_TECHNOLOGY = {
  id: '0001',
  name: 'Babel',
  quadrant: 'tools',
  isnew: true,
  description: 'Description of <strong>Babel</strong>'
};

class MockAppSessionService {
  private selectedTechnology: Technology;
  private selectedVotingEvent: VotingEvent;

  constructor() {
    this.selectedTechnology = TEST_TECHNOLOGY;
    this.selectedVotingEvent = { _id: '123', name: 'an event', status: 'open', creationTS: 'abc' };
  }

  getSelectedTechnology() {
    return this.selectedTechnology;
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }
}

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationComponent],
      imports: [AppMaterialModule, MatTreeModule, HttpClientTestingModule, CommentTreesModule],
      providers: [{ provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
