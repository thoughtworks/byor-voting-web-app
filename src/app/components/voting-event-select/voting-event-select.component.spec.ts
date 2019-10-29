import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '../../app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VotingEventSelectComponent } from './voting-event-select.component';
import { AppSessionService } from 'src/app/app-session.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { VotingEventService } from 'src/app/services/voting-event.service';
import { MockVotingEventService } from 'src/app/modules/test-mocks/mock-voting-event-service';

describe('VotingEventSelectComponent', () => {
  let component: VotingEventSelectComponent;
  let fixture: ComponentFixture<VotingEventSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [VotingEventSelectComponent],
      providers: [
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: VotingEventService, useClass: MockVotingEventService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingEventSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
