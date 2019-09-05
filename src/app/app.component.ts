import { Component, OnInit } from '@angular/core';
import { version } from './version';
import { Router } from '@angular/router';
import { BackendService } from './services/backend.service';
import { ErrorService } from './services/error.service';
import { AppSessionService } from './app-session.service';
import { getIdentificationRoute } from './utils/voting-event-flow.util';
import { map, tap, concatMap } from 'rxjs/operators';
import { ConfigurationService } from './services/configuration.service';
import { AuthService } from './modules/shared/login/auth.service';

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
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.logout(); // to remove any token which may be left appended to the browsers
    this.configurationService
      .defaultConfiguration()
      .pipe(
        tap((config) => {
          if (config.enableVotingEventFlow) {
            this.backend
              .getVotingEvents()
              .pipe(
                concatMap(() => this.backend.getVotingEvents()),
                map((votingEvents) => votingEvents.filter((ve) => ve.status === 'open')),
                tap((votingEvents) => {
                  if (!votingEvents || votingEvents.length === 0) {
                    this.errorService.setError(new Error('There are no Voting Events open'));
                    this.router.navigate(['error']);
                  } else if (votingEvents.length === 1) {
                    const votingEvent = votingEvents[0];
                    this.appSession.setSelectedVotingEvent(votingEvent);
                    const route = getIdentificationRoute(votingEvent);
                    this.router.navigate([route]);
                  } else {
                    this.appSession.setVotingEvents(votingEvents);
                    this.router.navigate(['selectVotingEvent']);
                  }
                })
              )
              .subscribe();
          } else {
            this.router.navigate(['vote']);
          }
        })
      )
      .subscribe();
  }

  goToAdminPage() {
    this.router.navigate(['admin']);
  }
}
