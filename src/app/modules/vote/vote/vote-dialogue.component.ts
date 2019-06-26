import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { TwRings } from '../../../models/ring';
import { HelpDialogueComponent } from './help-dialogue/help-dialogue.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {
    this.configuration$ = this.configurationService.defaultConfiguration().pipe(shareReplay(1));
  }

  allowVote() {
    return this.data.message ? false : true;
  }

  showComment$() {
    return this.configuration$.pipe(map((config) => (this.allowVote() ? !config.hideVoteComment : false)));
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
