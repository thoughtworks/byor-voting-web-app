import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AppMaterialModule } from '../../../app-material.module';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { VotingEventComponent } from '../voting-event/voting-event.component';
import { VoteService } from '../../vote/services/vote.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSessionService } from 'src/app/app-session.service';
import { MockAppSessionService } from '../../test-mocks/mock-app-session-service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent, VotingEventComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
      providers: [VoteService, { provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
