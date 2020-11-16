import { Component, Inject, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { TwRings } from '../../../models/ring';
import { HelpDialogueComponent } from './help-dialogue/help-dialogue.component';
import { Observable } from 'rxjs';
import { getActionParameters } from 'src/app/utils/voting-event-flow.util';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-vote-dialogue',
  templateUrl: './vote-dialogue.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteDialogueComponent implements OnInit, AfterViewInit {
  rings = TwRings.names;
  @ViewChild('comment') commentElRef: ElementRef;

  configuration$: Observable<any>;

  tags: string[] = [];
  allTags: string[];

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: string[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagInput', { read: MatAutocompleteTrigger }) tagInputMatAutocomplete: MatAutocompleteTrigger;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VoteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private votingEventService: VotingEventService
  ) {}

  ngOnInit() {
    const votingEvent = this.votingEventService.getSelectedVotingEvent();
    const actionParams = getActionParameters(votingEvent);
    this.allTags = actionParams && actionParams.tags ? actionParams.tags : [];
    this.filteredTags = [...this.allTags].sort();
  }
  ngAfterViewInit() {}

  allowVote() {
    return this.data.message ? false : true;
  }

  showComment() {
    const votingEvent = this.votingEventService.getSelectedVotingEvent();
    const actionStepParams = getActionParameters(votingEvent);
    return actionStepParams ? !actionStepParams.commentOnVoteBlocked : false;
  }

  showHelp() {
    this.dialog.open(HelpDialogueComponent, {
      width: '400px',
      maxWidth: '90vw'
    });
  }

  showTags() {
    return this.allTags && this.allTags.length > 0;
  }

  vote(ring: string) {
    const result: any = { ring };
    if (this.commentElRef) {
      result.comment = this.commentElRef.nativeElement.value;
    }
    if (this.tags) {
      result.tags = this.tags;
    }
    this.dialogRef.close(result);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.filteredTags.push(tag);
      this.filteredTags.sort();
    }
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    const tagValue = event.option.viewValue;
    this.tags.push(tagValue);
    this.tagInput.nativeElement.value = '';

    const indexToFilter = this.filteredTags.indexOf(tagValue);
    if (indexToFilter >= 0) {
      this.filteredTags.splice(indexToFilter, 1);
    }
  }

  inputClick(event) {
    this.tagInputMatAutocomplete.openPanel();
  }
}
