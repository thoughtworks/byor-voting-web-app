import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { combineLatest, Observable, merge, Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { VoteDialogueComponent } from './vote-dialogue.component';
import { VoteSavedDialogueComponent } from './vote-saved-dialogue.component';

import { BackendService } from '../../../services/backend.service';
import { Technology } from '../../../models/technology';
import { Vote } from '../../../models/vote';
import { VoteService } from '../services/vote.service';
import { VoteCredentials } from '../../../models/vote-credentials';
import * as _ from 'lodash';
import { TwRings } from 'src/app/models/ring';
import { Comment } from 'src/app/models/comment';
import { logError } from 'src/app/utils/utils';
import { AppSessionService } from 'src/app/app-session.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TechnologyListService } from '../../shared/technology-list/services/technology-list.service';
import { TechnologyListComponent } from '../../shared/technology-list/technology-list/technology-list.component';
import { getActionParameters, getIdentificationRoute } from 'src/app/utils/voting-event-flow.util';
import { tap, concatMap } from 'rxjs/operators';
import { VotingEventService } from 'src/app/services/voting-event.service';

@Component({
  selector: 'byor-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('techList') techList: TechnologyListComponent;
  rings = TwRings.names;

  votes = new Array<Vote>();
  votingEventId$: Observable<any>;

  messageVote: string;

  votingEventSubscription: Subscription;
  quadrantSubscription: Subscription;
  voteTechnologySubscription: Subscription;

  quadrants = new Array<string>();

  constructor(
    private backEnd: BackendService,
    private router: Router,
    public dialog: MatDialog,
    private voteService: VoteService,
    private appSession: AppSessionService,
    private configurationService: ConfigurationService,
    private votingEventService: VotingEventService,
    private technologyListService: TechnologyListService
  ) {}

  ngOnInit() {
    const votingEventShallow = this.appSession.getSelectedVotingEvent();
    // retrieve the details of the voting event
    this.votingEventSubscription = this.votingEventService.getVotingEvent(votingEventShallow._id).subscribe();
    // the quadrants are required to provide the correct css class to the Accordion which shows the votes
    this.quadrantSubscription = this.votingEventService.quadrants$.subscribe((_quadrants) => (this.quadrants = _quadrants));

    const voterId = this.appSession.getCredentials();
    this.voteTechnologySubscription = this.backEnd
      .getVotes(votingEventShallow._id, voterId)
      .pipe(
        tap((votes) => {
          this.votes = votes;
          this.excludeTechnologiesVoted();
        }),
        concatMap(() => merge(this.technologyListService.technologySelected$, this.votingEventService.newTechnologyAdded$))
      )
      .subscribe((tech) => this.openVoteDialog(tech));
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.votingEventSubscription) {
      this.votingEventSubscription.unsubscribe();
    }
    if (this.voteTechnologySubscription) {
      this.voteTechnologySubscription.unsubscribe();
    }
  }

  getVotesByRing(ring: string): Vote[] {
    return this.votes.filter((v) => v.ring === ring);
  }

  openVoteDialog(technology: Technology): void {
    let message: string;
    if (this.votes.length === environment.maxNumberOfVotes) {
      message = 'You have already given the max number of votes - cancel one vote if you want to vote for ' + technology.name;
    }
    const dialogRef = this.dialog.open(VoteDialogueComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: { technology, message }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const vote: Vote = {
          ring: result.ring,
          technology
        };
        if (result.comment) {
          const voteComment: Comment = {
            text: result.comment
          };
          vote.comment = voteComment;
        }
        if (result.tags) {
          vote.tags = result.tags;
        }
        if (vote.ring) {
          this.addVote(vote);
        }
      }
    });
  }

  addVote(vote: Vote) {
    this.votes.push(vote);
    this.excludeTechnologiesVoted();
  }

  removeVote(vote: Vote) {
    const index = this.votes.indexOf(vote);
    this.votes.splice(index, 1);
    this.excludeTechnologiesVoted();
  }

  excludeTechnologiesVoted() {
    const techsVoted = this.votes.map((v) => v.technology);
    this.techList.setTechnolgiesToExclude(techsVoted);
  }

  saveVotes() {
    const credentials = this.appSession.getCredentials();
    const votingEvent = this.appSession.getSelectedVotingEvent();
    let voterIdentification;
    let voteCredentials: VoteCredentials;
    if (credentials) {
      voterIdentification = credentials.nickname || credentials.userId;
      voteCredentials = { voterId: credentials, votingEvent };
    } else {
      voteCredentials = this.voteService.credentials;
      voterIdentification = voteCredentials.voterId.firstName + ' ' + voteCredentials.voterId.lastName;
    }
    const allowVoteOverride = !getActionParameters(votingEvent).voteOnlyOnce;
    this.backEnd.saveVote(this.votes, voteCredentials, allowVoteOverride).subscribe(
      (resp) => {
        if (resp.error) {
          if (resp.error.errorCode === 'V-01') {
            this.messageVote = `<strong> ${voterIdentification} </strong> has already voted`;
          } else {
            this.messageVote = `Vote could not be saved - look at the browser console 
            - maybe there is something there`;
          }
        } else {
          const dialogRef = this.dialog.open(VoteSavedDialogueComponent, {
            width: '400px'
          });

          dialogRef.afterClosed().subscribe((result) => {
            const route = getIdentificationRoute(this.appSession.getSelectedVotingEvent());
            this.router.navigate([route]);
          });
        }
      },
      (err) => {
        logError(err);
        this.messageVote = `Vote could not be saved - look at the browser console 
        - maybe there is something there`;
      }
    );
  }

  truncatedName(name: string) {
    const maxLength = 30;
    let shortName = name;
    if (name.length > maxLength) {
      shortName =
        _(name.substring(0, maxLength).split(' '))
          .tap(function(array) {
            array.pop();
          })
          .join(' ') + '...';
    }
    return shortName;
  }

  isAlreadyVoted(value: string) {
    const existingVote = this.votes.filter((vote) => vote.technology.name === value);
    return existingVote.length !== 0;
  }

  getClassForQuadrant(quadrant: string) {
    const quadrantIndex = this.quadrants.indexOf(quadrant.toUpperCase());
    return `q${quadrantIndex + 1}`;
  }
}
