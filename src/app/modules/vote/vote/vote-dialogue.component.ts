import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { TwRings } from '../../../models/ring';
import { HelpDialogueComponent } from './help-dialogue/help-dialogue.component';
import { Observable } from 'rxjs';
import { AppSessionService } from 'src/app/app-session.service';
import { getAction } from 'src/app/utils/voting-event-flow.util';

@Component({
  selector: 'byor-vote-dialogue',
  templateUrl: './vote-dialogue.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteDialogueComponent implements OnInit {
  rings = TwRings.names;
  @ViewChild('comment') commentElRef: ElementRef;

  configuration$: Observable<any>;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VoteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appSession: AppSessionService
  ) {}

  ngOnInit() {}

  allowVote() {
    return this.data.message ? false : true;
  }

  showComment() {
    const votingEvent = this.appSession.getSelectedVotingEvent();
    const actionStep = getAction(votingEvent);
    return !actionStep.commentOnVoteBlocked;
  }

  showHelp() {
    this.dialog.open(HelpDialogueComponent, {
      width: '400px',
      maxWidth: '90vw'
    });
  }

  vote(ring: string) {
    const result: any = { ring };
    if (this.commentElRef) {
      result.comment = this.commentElRef.nativeElement.value;
    }
    this.dialogRef.close(result);
  }
}
