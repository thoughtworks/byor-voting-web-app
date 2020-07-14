import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable, merge, Subscription } from 'rxjs';

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
import { TechnologyListComponent } from '../../shared/technology-list/technology-list/technology-list.component';
import { getActionParameters, getIdentificationRoute } from 'src/app/utils/voting-event-flow.util';
import { tap, concatMap, switchMap, map, shareReplay } from 'rxjs/operators';
import { VotingEventService } from 'src/app/services/voting-event.service';
import { VoteCloudService } from '../../admin/vote-cloud/vote-cloud.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from '../../shared/login/auth.service';

@Component({
  selector: 'byor-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('techList') techList: TechnologyListComponent;
  rings = TwRings.names;

  votes = new Array<Vote>();
  votesHaveBeenAlreadySaved = false;
  votingEventId$: Observable<any>;

  messageVote: string;

  votingEventSubscription: Subscription;

  quadrants = new Array<string>();

  configuration$: Observable<any>;

  constructor(
    private backEnd: BackendService,
    private router: Router,
    public dialog: MatDialog,
    private voteService: VoteService,
    private appSession: AppSessionService,
    private votingEventService: VotingEventService,
    private voteCloudService: VoteCloudService,
    private configurationService: ConfigurationService,
    private backend: BackendService,
    private authenticationService: AuthService
  ) {}

  ngOnInit() {
    this.configuration$ = this.configurationService.configurationForUser(this.authenticationService.user).pipe(shareReplay(1));
    // retrieve the details of the voting event and then the votes and then be ready to open the vote dialogue
    this.votingEventSubscription = this.votingEventService
      .getSelectedVotingEvent$()
      .pipe(
        concatMap((votingEvent) => this.backEnd.getVotes(votingEvent._id, this.appSession.getCredentials())),
        tap((votes) => {
          this.votes = votes;
          this.votesHaveBeenAlreadySaved = votes.length > 0;
          this.excludeTechnologiesVoted();
        }),
        // wait for a tech to be selected or a new tech to be added to move to the voting dialogue
        concatMap(() => merge(this.votingEventService.selectedTechnology$, this.votingEventService.newTechnologyAdded$))
      )
      .subscribe((tech) => this.openVoteDialog(tech));
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.votingEventSubscription) {
      this.votingEventSubscription.unsubscribe();
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
    this.appSession.voteAdded$.next('');
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
    // at this point we are sure there is a voting event selected and that this is stored as state in the service
    // we do not need to ask for the Observable since the selected voting event is not going to change as far as the
    // execution of this method is concerned, in other words at this point of execution voting event is not a stream
    const votingEvent = this.votingEventService.getSelectedVotingEvent();
    let voterIdentification;
    let voteCredentials: VoteCredentials;
    if (credentials) {
      voterIdentification = credentials.email || credentials.nickname || credentials.userId;
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
          this.votesHaveBeenAlreadySaved = true;
          const dialogRef = this.dialog.open(VoteSavedDialogueComponent, {
            width: '400px'
          });

          dialogRef.afterClosed().subscribe((result) => {});
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

  getClassForQuadrant$(quadrant: string) {
    return this.votingEventService.quadrants$.pipe(
      map((quadrants) => {
        const quadrantIndex = quadrants.indexOf(quadrant.toUpperCase());
        return `q${quadrantIndex + 1}`;
      })
    );
  }

  getSaveButtonName() {
    return this.votesHaveBeenAlreadySaved ? `Save Again` : `Save`;
  }

  viewVoteCloud() {
    this.voteCloudService.setVotingEvent(this.votingEventService.getSelectedVotingEvent());
    this.router.navigate(['admin/vote-cloud']);
  }

  viewRadarForSelectedEvent() {
    this.configuration$.subscribe((config) => {
      const selectedEvent = this.votingEventService.getSelectedVotingEvent();
      this.backend.getBlipsForSelectedEvent(selectedEvent, config);
    });
  }
}
