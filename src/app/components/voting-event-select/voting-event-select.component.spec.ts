import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '../../app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VotingEventSelectComponent } from './voting-event-select.component';
import { AppSessionService } from 'src/app/app-session.service';
import { VotingEvent } from 'src/app/models/voting-event';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';

describe('VotingEventSelectComponent', () => {
  let component: VotingEventSelectComponent;
  let fixture: ComponentFixture<VotingEventSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [VotingEventSelectComponent],
      providers: [{ provide: AppSessionService, useClass: MockAppSessionService }]
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
