import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SelectTechForConversationComponent } from './select-tech-for-conversation.component';
import { TechnologyListModule } from '../../technology-list/technology-list.module';
import { VoteService } from '../../vote/services/vote.service';

class MockVoteService {
  credentials;

  constructor() {
    this.credentials = {
      voterId: null,
      votingEvent: { technologies: [], name: null, status: 'closed', _id: null, creationTS: null }
    };
  }
}

describe('SelectTechForConversationComponent', () => {
  let component: SelectTechForConversationComponent;
  let fixture: ComponentFixture<SelectTechForConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTechForConversationComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, TechnologyListModule],
      providers: [{ provide: VoteService, useClass: MockVoteService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTechForConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
