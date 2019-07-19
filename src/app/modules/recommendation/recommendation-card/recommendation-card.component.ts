import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

import { mostVotedRings } from 'src/app/models/technology';
import { AppSessionService } from 'src/app/app-session.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'byor-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent implements OnInit {
  @ViewChild('commentText') commentElRef: ElementRef;

  showConfirmButton$ = new ReplaySubject<boolean>(1);
  recommendationText: string;
  placeholderText: string;

  message$ = new Subject();

  constructor(private appSession: AppSessionService) {}

  ngOnInit() {
    const selectedTech = this.appSession.getSelectedTechnology();
    if (selectedTech.recommendandation && selectedTech.recommendandation.text) {
      // this.recommendationText = selectedTech.recommendandation.text;
      return;
    }

    // maxVotes contains the rings which have collected the highest number of votes
    // it is an array to contemplated the possibility that 2 or more rings can receive the same numberof votes
    const maxVotes = mostVotedRings(selectedTech);

    if (maxVotes.length === 1) {
      this.oneRingWithMaxVotes(maxVotes[0].ring);
    } else if (maxVotes.length > 1) {
      this.moreThanOneRingWithMaxVotes();
    } else {
      this.noVotes();
    }
  }

  oneRingWithMaxVotes(ringsWithMaxVotes: string) {
    const text = `Confirm ring ${ringsWithMaxVotes} or choose a different ring specifying the reasons in the comment`;
    this.showConfirmButton$.next(true);
    this.placeholderText = text;
  }
  moreThanOneRingWithMaxVotes() {
    const text = `More than one ring got max number of votes. Choose a ring specifying the reasons in the comment`;
    this.showConfirmButton$.next(false);
    this.placeholderText = text;
  }
  noVotes() {
    const text = `Choose a ring specifying the reasons in the comment`;
    this.showConfirmButton$.next(false);
    this.placeholderText = text;
  }

  getCommentTextFromView() {
    return this.commentElRef.nativeElement.value;
  }
  getCommentTextSelectedTech$() {
    return this.appSession.selectedTechnology$.pipe(map((tech) => tech.recommendandation.text));
  }
}
