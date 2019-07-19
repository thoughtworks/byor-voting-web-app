import { Component, OnInit, Input } from '@angular/core';
import { Technology, mostVotedRings } from 'src/app/models/technology';
import { AppSessionService } from 'src/app/app-session.service';

@Component({
  selector: 'byor-technology-voting-result',
  template: `
    <mat-card class="voting-results-card">
      <mat-card-title>
        <span class="tech-name"> {{ technologyName() }} </span>
        <span class="most-voted-rings-text">
          {{ this.mostVotedRingsText() }}
          <span *ngFor="let maxVote of mostVotedRings()" class="most-voted-rings">{{ maxVote.ring }}</span>
        </span>
        <span class="number-votes-comments-text" *ngIf="numberOfVotes()">
          #votes <span class="number-votes-comments">{{ numberOfVotes() }}</span>
        </span>
        <span class="number-votes-comments-text" *ngIf="numberOfComments()">
          #comments <span class="number-votes-comments">{{ numberOfComments() }}</span>
        </span>
        <span class="number-votes-comments-text" *ngIf="!numberOfVotes()">
          no votes for this Technology
        </span>
      </mat-card-title>
      <mat-card-subtitle *ngIf="numberOfVotesPerRing()">
        <span class="ring-votes">Votes per ring</span>
        <span *ngFor="let v of numberOfVotesPerRing()">
          <span class="ring">{{ v.ring }}</span>
          <span class="number-of-votes">{{ v.count }}</span>
        </span>
      </mat-card-subtitle>
      <mat-card-subtitle *ngIf="numberOfTagsPerTag()">
        <span class="tags">Tags</span>
        <span *ngFor="let t of numberOfTagsPerTag()">
          <span class="tag">{{ t.tag }}</span>
          <span class="number-of-tags">{{ t.count }}</span>
        </span>
      </mat-card-subtitle>
    </mat-card>
  `,
  styleUrls: ['./technology-voting-result.component.scss']
})
export class TechnologyVotingResultComponent implements OnInit {
  constructor(public appSession: AppSessionService) {}

  ngOnInit() {}

  technologyName() {
    return this.appSession.getSelectedTechnology().name;
  }
  mostVotedRingsText() {
    let ret = '';
    const selectedTech = this.appSession.getSelectedTechnology();
    const maxVotes = mostVotedRings(selectedTech);
    if (maxVotes.length === 1) {
      ret = `Ring most voted is`;
    } else if (maxVotes.length > 1) {
      ret = `The rings most voted are`;
    }
    return ret;
  }
  mostVotedRings() {
    const selectedTech = this.appSession.getSelectedTechnology();
    return mostVotedRings(selectedTech);
  }
  numberOfVotes() {
    return this.appSession.getSelectedTechnology().numberOfVotes;
  }
  numberOfComments() {
    return this.appSession.getSelectedTechnology().numberOfComments;
  }

  numberOfVotesPerRing() {
    if (this.appSession.getSelectedTechnology().votingResult) {
      return this.appSession.getSelectedTechnology().votingResult.votesForRing;
    }
  }

  numberOfTagsPerTag() {
    if (this.appSession.getSelectedTechnology().votingResult) {
      return this.appSession.getSelectedTechnology().votingResult.votesForTag;
    }
  }
}
