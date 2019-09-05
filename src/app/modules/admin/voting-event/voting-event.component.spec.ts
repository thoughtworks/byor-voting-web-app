import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AppMaterialModule } from '../../../app-material.module';

import { VotingEventComponent } from './voting-event.component';
import { EventsService } from '../../../services/events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSessionService } from 'src/app/app-session.service';
import { MockAppSessionService } from '../../test-mocks/mock-app-session-service';

describe('VotingEventComponent', () => {
  let component: VotingEventComponent;
  let fixture: ComponentFixture<VotingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VotingEventComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, NoopAnimationsModule, RouterTestingModule, AppMaterialModule],
      providers: [EventsService, { provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
