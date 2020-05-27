import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { BackendService } from 'src/app/services/backend.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/login/auth.service';
import { VotingEvent } from 'src/app/models/voting-event';
import { shareReplay } from 'rxjs/operators';
import { VotingEventService } from 'src/app/services/voting-event.service';
import { VoteCloudService } from '../../admin/vote-cloud/vote-cloud.service';

@Component({
  selector: 'byor-vote-saved-dialogue',
  templateUrl: './vote-saved-dialogue.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteSavedDialogueComponent implements OnInit {
  votingEvents$: Observable<Array<VotingEvent>>;
  votingEvents: Array<VotingEvent>;
  configuration$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<VoteSavedDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private backend: BackendService,
    private votingEventService: VotingEventService,
    private configurationService: ConfigurationService,
    private authenticationService: AuthService,
    private voteCloudService: VoteCloudService
  ) {}

  ngOnInit() {
    this.configuration$ = this.configurationService.configurationForUser(this.authenticationService.user).pipe(shareReplay(1));
  }

  viewVoteCloud() {
    this.voteCloudService.setVotingEvent(this.votingEventService.getSelectedVotingEvent());
    this.router.navigate(['admin/vote-cloud']);
    this.dialogRef.close('no-redirect');
  }

  viewRadarForSelectedEvent() {
    this.configuration$.subscribe((config) => {
      const selectedEvent = this.votingEventService.getSelectedVotingEvent();
      this.backend.getBlipsForSelectedEvent(selectedEvent, config);
    });
  }
}
