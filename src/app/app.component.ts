import { Component, OnInit } from '@angular/core';
import { version } from './version';
import { Router } from '@angular/router';
import { BackendService } from './services/backend.service';
import { ErrorService } from './services/error.service';
import { AppSessionService } from './app-session.service';
import { getIdentificationRoute } from './utils/voting-event-flow.util';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './modules/shared/login/auth.service';
import { VotingEventService } from './services/voting-event.service';

@Component({
  selector: 'byor-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  version = version;

  constructor(
    private router: Router,
    private backend: BackendService,
    public errorService: ErrorService,
    private appSession: AppSessionService,
    private authService: AuthService,
    private votingEventService: VotingEventService
  ) {}

  ngOnInit() {
    this.authService.logout(); // to remove any token which may be left appended to the browsers
    this.backend
      .getVotingEvents()
      .pipe(
        map((votingEvents) => votingEvents.filter((ve) => ve.status === 'open')),
        tap((votingEvents) => {
          if (!votingEvents || votingEvents.length === 0) {
            this.errorService.setError(new Error('There are no Voting Events open'));
            this.router.navigate(['error']);
          } else if (votingEvents.length === 1) {
            // if there is only one event open then automatically this becomes the selected event
            const votingEvent = votingEvents[0];
            this.votingEventService.setVotingEvent(votingEvent);
            const route = getIdentificationRoute(votingEvent);
            this.router.navigate([route]);
          } else {
            this.appSession.setVotingEvents(votingEvents);
            this.router.navigate(['selectVotingEvent']);
          }
        })
      )
      .subscribe();
  }

  goToAdminPage() {
    this.router.navigate(['admin']);
  }
}
