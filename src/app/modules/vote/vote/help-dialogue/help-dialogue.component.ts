import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TwRings } from 'src/app/models/ring';

@Component({
  selector: 'byor-help-dialogue',
  templateUrl: './help-dialogue.component.html',
  styleUrls: ['./help-dialogue.component.scss']
})
export class HelpDialogueComponent implements OnInit {
  rings = TwRings.definitions;

  constructor(public dialogRef: MatDialogRef<HelpDialogueComponent>) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close(); //test
  }

}
