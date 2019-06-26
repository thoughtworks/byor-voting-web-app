
import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'byor-vote-saved-dialogue',
  templateUrl: './vote-saved-dialogue.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteSavedDialogueComponent {

  constructor(
      public dialogRef: MatDialogRef<VoteSavedDialogueComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

}
