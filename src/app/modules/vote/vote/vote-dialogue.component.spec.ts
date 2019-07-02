import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteDialogueComponent } from './vote-dialogue.component';

import { MatCardModule } from '@angular/material/card';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VotingEvent } from 'src/app/models/voting-event';
import { AppSessionService } from 'src/app/app-session.service';

class MockAppSessionService {
  private selectedVotingEvent: VotingEvent;

  constructor() {
    this.selectedVotingEvent = {
      _id: '123',
      name: 'an event',
      status: 'open',
      creationTS: 'abc',
      flow: { steps: [{ name: 'the flow', identification: { name: 'nickname' }, action: { name: 'vote' } }] }
    };
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }
}

describe('VoteDialogueComponent', () => {
  let component: VoteDialogueComponent;
  let fixture: ComponentFixture<VoteDialogueComponent>;
  const matDialogData = {
    technology: { name: 'test tech' },
    message: 'test message'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteDialogueComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: matDialogData },
        { provide: AppSessionService, useClass: MockAppSessionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open help dialogue when clicking help icon', () => {
    TestBed.get(MAT_DIALOG_DATA).message = undefined;
    fixture.detectChanges();

    spyOn(component, 'showHelp');

    const helpButton = fixture.debugElement.nativeElement.querySelector('.help-dialogue-button');
    helpButton.click();

    fixture.whenStable().then(() => {
      expect(component.showHelp).toHaveBeenCalled();
    });
  });
});
