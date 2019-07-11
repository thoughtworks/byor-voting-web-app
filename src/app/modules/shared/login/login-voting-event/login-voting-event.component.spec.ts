import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from '../../../../app-material.module';

import { LoginVotingEventComponent } from './login-voting-event.component';
import { AppSessionService } from 'src/app/app-session.service';

describe('LoginVotingEventComponent', () => {
  let component: LoginVotingEventComponent;
  let fixture: ComponentFixture<LoginVotingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginVotingEventComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
      providers: [AppSessionService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginVotingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
