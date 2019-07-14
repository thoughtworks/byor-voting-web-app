import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, never, NEVER } from 'rxjs';
import { shareReplay, tap, map, switchMap, catchError } from 'rxjs/operators';

import { BackendService } from '../../../services/backend.service';
import { VotingEvent } from '../../../models/voting-event';
import { ErrorService } from 'src/app/services/error.service';
import { ERRORS } from 'src/app/services/errors';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from '../../shared/login/auth.service';
import { EventsService } from '../../../services/events.service';
import { VoteCloudService } from '../vote-cloud/vote-cloud.service';
import { getNextActionName, getActionName, getNextAction } from 'src/app/utils/voting-event-flow.util';

@Component({
  selector: 'byor-voting-event',
  templateUrl: './voting-event.component.html',
  styleUrls: ['./voting-event.component.scss']
})
export class VotingEventComponent implements OnInit {
  eventCreationForm = new FormGroup({
    eventNameControl: new FormControl('', [Validators.required])
  });
  messageCreate: string;
  messageAction: string;

  votingEvents$: Observable<Array<VotingEvent>>;
  selectedName: string;
  votingEvents: Array<VotingEvent>;
  configuration$: Observable<any>;

  constructor(
    private router: Router,
    private backend: BackendService,
    private eventsService: EventsService,
    private errorService: ErrorService,
    private configurationService: ConfigurationService,
    private authenticationService: AuthService,
    private voteCloudService: VoteCloudService
  ) {}

  ngOnInit() {
    this.refreshVotingEvents();

    this.configuration$ = this.configurationService.configurationForUser(this.authenticationService.user).pipe(shareReplay(1));
  }

  refreshVotingEvents() {
    this.votingEvents$ = this.backend.getVotingEvents().pipe(
      catchError((err) => {
        this.errorService.setError(err);
        this.router.navigate(['/error']);
        return NEVER;
      }),
      map((events) => events.sort((a, b) => (a.name > b.name ? 1 : -1))),
      tap((events) => (this.votingEvents = events)),
      shareReplay(1)
    );
  }

  cleanMessages() {
    this.messageCreate = null;
    this.messageAction = null;
  }

  onSubmit() {
    this.cleanMessages();
    const inputValue = this.eventCreationForm.controls.eventNameControl.value;
    this.backend.createVotingEvent(inputValue).subscribe(
      (resp) => {
        if (resp.error) {
          if (resp.error.errorCode === ERRORS.votingEventAlreadyPresent) {
            this.messageCreate = `Event <strong> ${inputValue} </strong> already exists`;
          } else {
            this.messageCreate = `Event <strong> ${inputValue}  </strong> could not be created - look at the browser console 
            - maybe there is something there`;
          }
        } else {
          this.messageCreate = `Event <strong> ${inputValue} </strong> successfully created`;
        }
      },
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageCreate = `Event <strong> ${inputValue}  </strong> could not be created - look at the browser console 
        - maybe there is something there`;
      },
      () => this.refreshVotingEvents()
    );
  }

  getSelectedEvent() {
    if (!this.votingEvents) {
      return null;
    }
    const thisVotingEvent = this.votingEvents.find((event) => event.name === this.selectedName);
    this.eventsService.setSelectedEvent(thisVotingEvent);
    return thisVotingEvent;
  }

  isSelectedEventOpen() {
    if (!this.votingEvents) {
      return false;
    }
    const selectedVotingEvent = this.getSelectedEvent();
    return selectedVotingEvent && selectedVotingEvent.status === 'open';
  }
  isSelectedEventClosed() {
    if (!this.selectedName) {
      return false;
    }
    return !this.isSelectedEventOpen();
  }
  showTechnologiesForRevote() {
    if (!this.selectedName) {
      return false;
    }
    const selectedVotingEvent = this.getSelectedEvent();
    return this.isSelectedEventOpen() && selectedVotingEvent.hasTechnologiesForRevote;
  }
  canBeOpenedForRevote() {
    if (!this.selectedName) {
      return false;
    }
    const selectedVotingEvent = this.getSelectedEvent();
    return this.isSelectedEventOpen() && selectedVotingEvent.hasTechnologiesForRevote && !selectedVotingEvent.openForRevote;
  }
  canBeClosedForRevote() {
    if (!this.selectedName) {
      return false;
    }
    const selectedVotingEvent = this.getSelectedEvent();
    return this.isSelectedEventOpen() && selectedVotingEvent.openForRevote;
  }

  openSelectedEvent() {
    this.cleanMessages();
    const selectedEventId = this.getSelectedEvent()._id;
    this.backend.openVotingEvent(selectedEventId).subscribe(
      () => (this.messageAction = `Event <strong> ${this.selectedName} </strong> opened`),
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageAction = `Event <strong> ${this.selectedName} </strong> could not be opened - 
      look at the browser console to see if there is any detail`;
      },
      () => this.refreshVotingEvents()
    );
  }
  closeSelectedEvent() {
    this.cleanMessages();
    const selectedEventId = this.getSelectedEvent()._id;
    this.backend.closeVotingEvent(selectedEventId).subscribe(
      () => (this.messageAction = `Event <strong> ${this.selectedName} </strong> closed`),
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageAction = `Event <strong> ${this.selectedName} </strong> could not be closed - 
      look at the browser console to see if there is any detail`;
      },
      () => this.refreshVotingEvents()
    );
  }

  voters() {
    this.router.navigate(['admin/voters']);
  }

  viewVoteCloud() {
    this.viewVoteCloudForEvent(this.getSelectedEvent());
  }

  viewVoteCloudForAllEvents() {
    this.viewVoteCloudForEvent(null);
  }

  viewVoteCloudForEvent(event?: VotingEvent) {
    this.voteCloudService.setVotingEvent(event);
    this.router.navigate(['admin/vote-cloud']);
  }

  openForRevote() {
    this.cleanMessages();
    const selectedEvent = this.getSelectedEvent();
    this.backend.openForRevote(selectedEvent).subscribe(
      () => (this.messageAction = `Event <strong> ${this.selectedName} </strong> open for revote`),
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageAction = `Event <strong> ${this.selectedName} </strong> could not be opened for revote - 
      look at the browser console to see if there is any detail`;
      },
      () => this.refreshVotingEvents()
    );
  }
  closeForRevote() {
    this.cleanMessages();
    const selectedEvent = this.getSelectedEvent();
    this.backend.closeForRevote(selectedEvent).subscribe(
      () => (this.messageAction = `Event <strong> ${this.selectedName} </strong> closed for revote`),
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageAction = `Event <strong> ${this.selectedName} </strong> could not be closed for revote - 
      look at the browser console to see if there is any detail`;
      },
      () => this.refreshVotingEvents()
    );
  }

  techForRevote() {
    this.configuration$.subscribe((config) => {
      const selectedEvent = this.getSelectedEvent();
      this.backend.techForRevote(selectedEvent, config);
    });
  }

  viewRadarForSelectedEvent() {
    this.configuration$.subscribe((config) => {
      const selectedEvent = this.getSelectedEvent();
      this.backend.getBlipsForSelectedEvent(selectedEvent, config);
    });
  }

  viewRadarForAllEvents() {
    this.configuration$.subscribe((config) => {
      this.backend.getBlipsForAllEvent(config);
    });
  }

  unauthorized() {
    this.authenticationService.logout();
    this.authenticationService.setMessage('Request not authorized - pls login and try again');
    this.router.navigate(['login']);
  }

  getNextStepButtonText() {
    const nextStepName = getNextActionName(this.getSelectedEvent());
    if (!nextStepName) {
      throw new Error(
        `No next step for event ${this.getSelectedEvent().name} which is already at step ${getActionName(this.getSelectedEvent())}`
      );
    }
    return `Go to "${nextStepName}"`;
  }
  isNextStepAvailable() {
    return !!getNextAction(this.getSelectedEvent());
  }

  goToNextStep() {
    this.backend.moveToNexFlowStep(this.getSelectedEvent()._id).subscribe(
      () =>
        (this.messageAction = `Event <strong> ${this.selectedName} </strong> moved to step "${getNextActionName(
          this.getSelectedEvent()
        )}"`),
      (err) => {
        if (err.errorCode === ERRORS.unauthorized) {
          this.unauthorized();
          return;
        }
        this.messageAction = `Event <strong> ${this.selectedName} </strong> could not be moved to next step - 
      look at the browser console to see if there is any detail`;
      },
      () => this.refreshVotingEvents()
    );
  }
}
