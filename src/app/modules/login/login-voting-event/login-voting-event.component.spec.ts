import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginVotingEventComponent } from './login-voting-event.component';

describe('LoginVotingEventComponent', () => {
  let component: LoginVotingEventComponent;
  let fixture: ComponentFixture<LoginVotingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginVotingEventComponent ]
    })
    .compileComponents();
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
