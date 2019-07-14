import { Component, OnInit, Input } from '@angular/core';
import { Technology } from 'src/app/models/technology';
import { AppSessionService } from 'src/app/app-session.service';

@Component({
  selector: 'byor-technology-voting-result',
  template: `
    <mat-card class="voting-results-card">
      <mat-card-title [innerHTML]="nameAndRing()"></mat-card-title>
      <mat-card-subtitle [innerHTML]="numberOfVotesPerRing()"></mat-card-subtitle>
      <mat-card-subtitle [innerHTML]="numberOfTagsPerTag()"></mat-card-subtitle>
    </mat-card>
  `,
  styleUrls: ['./technology-voting-result.component.scss']
})
export class TechnologyVotingResultComponent implements OnInit {
  constructor(public appSession: AppSessionService) {}

  ngOnInit() {}

  nameAndRing() {
    return `<span> ${
      this.appSession.getSelectedTechnology().name
    } </span> <span>${this.mostVotedRings()}</span> <span>${this.numberOfVotesAndComments()}</span>`;
  }
  mostVotedRings() {
    let ret: string;
    const selectedTech = this.appSession.getSelectedTechnology();
    if (selectedTech.votingResult) {
      const votes = selectedTech.votingResult.votesForRing;
      let max = 0;
      const maxVotes = votes.reduce((ringsWithMaxVotes, ring) => {
        if (max < ring.count) {
          ringsWithMaxVotes = [ring];
          max = ring.count;
        } else if (max === ring.count) {
          ringsWithMaxVotes.push(ring);
        }
        return ringsWithMaxVotes;
      }, []);
      if (maxVotes.length === 1) {
        ret = `<span>Ring most voted is ${maxVotes[0].ring}</span>`;
      } else if (maxVotes.length > 1) {
        ret = `<span>The rings most voted are`;
        maxVotes.forEach((v) => (ret = ret + `<span>${v.ring}</span>`));
        ret = ret + `</span>`;
      }
    }
    return ret;
  }
  numberOfVotesAndComments() {
    let ret: string;
    ret = this.appSession.getSelectedTechnology().numberOfVotes
      ? `<span> #votes ${this.appSession.getSelectedTechnology().numberOfVotes} </span>`
      : ret;
    ret = this.appSession.getSelectedTechnology().numberOfComments
      ? ret + `<span> #comments ${this.appSession.getSelectedTechnology().numberOfComments} </span>`
      : ret;
    return ret;
  }
  numberOfVotesPerRing() {
    let ret: string;
    const selectedTech = this.appSession.getSelectedTechnology();
    if (selectedTech.numberOfVotes) {
      ret = this.appSession.getSelectedTechnology().votingResult.votesForRing.reduce((text, v) => {
        text = text + `<span> #${v.ring} </span> <span>${v.count} </span> `;
        return text;
      }, '<span>Votes per ring</span>');
    }
    return ret;
  }
  numberOfTagsPerTag() {
    let ret: string;
    const selectedTech = this.appSession.getSelectedTechnology();
    if (selectedTech.votingResult && selectedTech.votingResult.votesForTag) {
      ret = this.appSession.getSelectedTechnology().votingResult.votesForTag.reduce((text, t) => {
        text = text + `<span> #${t.tag} </span> <span>${t.count} </span> `;
        return text;
      }, '<span>Tags </span>');
    }
    return ret;
  }
}
