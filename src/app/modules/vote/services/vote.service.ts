// Simple  service used to store the credetials of the Voter and the Voting Event
import { Injectable } from '@angular/core';
import { VoteCredentials } from '../../../models/vote-credentials';
import { VotingEvent } from '../../../models/voting-event';
import { Observable } from 'rxjs';
import { ServiceNames } from '../../../services/service-names';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from '../../../shared/http-error-handler/http-error-handler.service';
import { Technology } from 'src/app/models/technology';

@Injectable()
export class VoteService {
  // TODO: Remove
  credentials: VoteCredentials;
  technology: Technology;

  private voter: { firstName: string; lastName: string };
  private selectedEvent: VotingEvent;

  url = environment.serviceUrl;
  private readonly handleError: HandleError;
  private defaultMessage = 'Something went wrong; Please try again';

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('VoteService');
  }

  setVoter(voter: { firstName: string; lastName: string }) {
    this.voter = voter;
  }

  setSelectedEvent(event: VotingEvent) {
    this.selectedEvent = event;
  }

  hasVotedForEvent(): Observable<boolean> {
    const payload = {
      service: ServiceNames[ServiceNames.hasAlreadyVoted],
      credentials: {
        voterId: this.voter,
        votingEvent: {
          _id: this.selectedEvent._id
        }
      }
    };

    return this.http.post(this.url, payload).pipe(
      map((resp: any) => resp.data),
      catchError(this.handleError<string>(this.defaultMessage))
    );
  }

  getVotingEvents(): Observable<Array<VotingEvent>> {
    const payload = {
      service: ServiceNames[ServiceNames.getVotingEvents]
    };
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => resp.data),
      catchError(this.handleError<string>(this.defaultMessage))
    );
  }
}
