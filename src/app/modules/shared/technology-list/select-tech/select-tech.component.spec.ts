import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppMaterialModule } from 'src/app/app-material.module';

import { SelectTechComponent } from './select-tech.component';
import { VoteService } from '../../../vote/services/vote.service';
import { TechnologyListService } from '../services/technology-list.service';
import { TechnologyListComponent } from '../technology-list/technology-list.component';

class MockVoteService {
  credentials;

  constructor() {
    this.credentials = {
      voterId: null,
      votingEvent: {
        technologies: [],
        name: null,
        status: 'closed',
        _id: null,
        creationTS: null,
        flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
      }
    };
  }
}

describe('SelectTechComponent', () => {
  let component: SelectTechComponent;
  let fixture: ComponentFixture<SelectTechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTechComponent, TechnologyListComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule, HttpClientTestingModule, AppMaterialModule],
      providers: [{ provide: VoteService, useClass: MockVoteService }, TechnologyListService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
