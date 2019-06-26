import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCloudComponent } from './vote-cloud.component';
import { VoteCloudService } from './vote-cloud.service';
import { EMPTY } from 'rxjs';

class MockVoteCloudService {
  vote() {
    return EMPTY;
  }

  getVotingEvent() {
    return null;
  }
}

describe('VoteCloudComponent', () => {
  let component: VoteCloudComponent;
  let fixture: ComponentFixture<VoteCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteCloudComponent ],
      providers: [ {provide: VoteCloudService, useClass: MockVoteCloudService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
