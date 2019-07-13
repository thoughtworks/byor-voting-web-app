import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NicknameComponent } from './nickname.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from 'src/app/app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VotingEvent } from 'src/app/models/voting-event';
import { AppSessionService } from 'src/app/app-session.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';

describe('NicknameComponent', () => {
  let component: NicknameComponent;
  let fixture: ComponentFixture<NicknameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NicknameComponent],
      imports: [RouterTestingModule, AppMaterialModule, HttpClientModule, BrowserAnimationsModule],
      providers: [{ provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
