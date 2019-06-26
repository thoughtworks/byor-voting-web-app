import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceNames } from './service-names';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from '../shared/http-error-handler/http-error-handler.service';
import { VotingEvent } from '../models/voting-event';
import { Blip } from '../models/blip';
import { getDataFrom } from '../utils/response.util';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly handleError: HandleError;
  private defaultMessage = 'Something went wrong; Please try again';

  private selectedEvent: VotingEvent;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('EventsService');
  }

  setSelectedEvent(event: VotingEvent) {
    this.selectedEvent = event;
  }

  getSelectedEvent() {
    return this.selectedEvent;
  }


  fetchVotingEvent(eventId: string): Observable<VotingEvent> {
    const payload = {
      service: ServiceNames[ServiceNames.getVotingEvent],
      _id: eventId
    };

    return this.httpPost(payload);
  }

  getEvents(): Observable<Array<VotingEvent>> {
    const payload = {
      service: ServiceNames[ServiceNames.getVotingEvents]
    };

    return this.httpPost(payload);
  }

  createVotingEvent(name: string) {
    const payload = {
      service: ServiceNames[ServiceNames.createVotingEvent],
      name: name
    };

    return this.httpPost(payload);
  }

  openVotingEvent(id: string) {
    const payload = {
      service: ServiceNames[ServiceNames.openVotingEvent],
      _id: id
    };

    return this.httpPost(payload);
  }

  closeVotingEvent(id: string) {
    const payload = {
      service: ServiceNames[ServiceNames.closeVotingEvent],
      _id: id
    };

    return this.httpPost(payload);
  }

  cancelVotingEvent(name: string, hard: boolean = false) {
    const payload = {
      service: ServiceNames[ServiceNames.cancelVotingEvent],
      name: name,
      hard: hard
    };

    return this.httpPost(payload);
  }

  openForRevote(votingEvent: VotingEvent): Observable<Array<Blip>> {
    const payload = {
      service: ServiceNames[ServiceNames.openForRevote],
      _id: votingEvent._id,
      round: votingEvent.round
    };

    return this.httpPost(payload);
  }

  closeForRevote(votingEvent: VotingEvent): Observable<Array<Blip>> {
    const payload = {
      service: ServiceNames[ServiceNames.closeForRevote],
      _id: votingEvent._id
    };

    return this.httpPost(payload);
  }

  httpPost<T>(payload: any): Observable<T> {
    return this.http
      .post(environment.serviceUrl, payload)
      .pipe(
        map((resp: any) => getDataFrom(resp)),
        catchError(this.handleError<string>(this.defaultMessage))
      );
  }
}
