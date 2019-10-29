import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteDialogueComponent } from './vote-dialogue.component';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModule } from 'src/app/app-material.module';

import { VotingEventService } from 'src/app/services/voting-event.service';
import { MockVotingEventService } from '../../test-mocks/mock-voting-event-service';

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
      imports: [AppMaterialModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: matDialogData },
        { provide: VotingEventService, useClass: MockVotingEventService }
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
