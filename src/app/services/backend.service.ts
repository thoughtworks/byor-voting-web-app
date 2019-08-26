import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ServiceNames } from './service-names';

import { Technology, Recommendation } from '../models/technology';
import { Vote } from '../models/vote';
import { VotingEvent } from '../models/voting-event';
import { VoteCredentials } from '../models/vote-credentials';
import { Blip } from '../models/blip';
import { ERRORS } from './errors';
import { logError } from '../utils/utils';
import { inspect } from 'util';
import { Comment } from '../models/comment';
import { VotingEventFlow } from '../models/voting-event-flow';
import { Credentials } from '../models/credentials';

interface BackEndError {
  errorCode: string;
  message: string;
  mongoErrorCode: number;
}
interface RespFromBackend {
  data: any;
  error: BackEndError;
  serviceName: string;
  code: number;
}
// interface RespFromBackend<T> {
//   data: T;
//   error: BackEndError;
//   serviceName: string;
//   code: number;
// }

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url = environment.serviceUrl;
  private defaultSiteName = 'BUILD YOUR OWN RADAR';

  constructor(private http: HttpClient) {}

  getTechnologies(): Observable<Array<Technology>> {
    const payload = this.buildPostPayloadForService(ServiceNames.getTechnologies);
    return (
      this.http
        .post(this.url, payload)
        // .post<RespFromBackend<Array<Technology>>>(url, payload)
        .pipe(
          map((resp: any) => {
            return resp.data.technologies;
          }),
          catchError(this.handleError)
        )
    );
  }

  addTechnology(technology: Technology) {
    const payload = this.buildPostPayloadForService(ServiceNames.addTechnology);
    payload['technology'] = technology;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }
  getTechnology(name: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.getTechnology);
    payload['name'] = name;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }
  updateTechnology(technology: Technology) {
    const payload = this.buildPostPayloadForService(ServiceNames.updateTechnology);
    payload['technology'] = technology;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }
  deleteTechnology(_id: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.deleteTechnology);
    payload['_id'] = _id;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  hasAlreadyVoted(credentials: VoteCredentials): Observable<boolean> {
    const payload = this.buildPostPayloadForService(ServiceNames.hasAlreadyVoted);
    // reduce the size of the payload
    const _credentials = {
      voterId: credentials.voterId,
      votingEvent: {
        _id: credentials.votingEvent._id
      }
    };
    payload['credentials'] = _credentials;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getVotes(votingEventId: string, voterId?: Credentials): Observable<Array<Vote>> {
    const payload = this.buildPostPayloadForService(ServiceNames.getVotes);
    payload['eventId'] = votingEventId;
    payload['voterId'] = voterId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  saveVote(votes: Array<Vote>, credentials: VoteCredentials, override?: boolean) {
    const payload = this.buildPostPayloadForService(ServiceNames.saveVotes);
    payload['votes'] = votes;
    payload['credentials'] = credentials;
    if (override) {
      payload['override'] = override;
    }
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getVotesWithCommentsForTechAndEvent(technologyId: string, eventId: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.getVotesWithCommentsForTechAndEvent);
    payload['technologyId'] = technologyId;
    payload['eventId'] = eventId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  addReplyToVoteComment(voteId: string, reply: Comment, commentReceivingReplyId: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.addReplyToVoteComment);
    payload['voteId'] = voteId;
    payload['reply'] = reply;
    payload['commentReceivingReplyId'] = commentReceivingReplyId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  // getAggregatedVotes(votingEvent: VotingEvent): Observable<Array<AggregatedVote>> {
  //   const payload = this.buildPostPayloadForService(ServiceNames.aggregateVotes);
  //   payload['votingEvent'] = votingEvent;
  //   return this.http
  //     .post(this.url, payload)
  //     .pipe(
  //       map((resp: any) => {
  //         return this.handleReponseDefault(resp);
  //       }),
  //       catchError(this.handleError),
  //     );
  // }

  calculateBlips(votingEvent: VotingEvent, thresholdForRevote?: number): Observable<Array<Blip>> {
    const payload = this.buildPostPayloadForService(ServiceNames.calculateBlips);
    // reduce the size of the payload
    const _votingEvent = { _id: votingEvent._id };
    payload['votingEvent'] = _votingEvent;
    if (thresholdForRevote) {
      payload['thresholdForRevote'] = thresholdForRevote;
    }
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  calculateBlipsFromAllEvents() {
    const payload = this.buildPostPayloadForService(ServiceNames.calculateBlipsFromAllEvents);
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  openForRevote(votingEvent: VotingEvent): Observable<Array<Blip>> {
    const payload = this.buildPostPayloadForService(ServiceNames.openForRevote);
    // reduce the size of the payload to the bare minimum
    payload['_id'] = votingEvent._id;
    payload['round'] = votingEvent.round;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  closeForRevote(votingEvent: VotingEvent): Observable<Array<Blip>> {
    const payload = this.buildPostPayloadForService(ServiceNames.closeForRevote);
    // reduce the size of the payload to the bare minimum
    payload['_id'] = votingEvent._id;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getVotingEvents(params?: { all: boolean }): Observable<Array<VotingEvent>> {
    const payload = this.buildPostPayloadForService(ServiceNames.getVotingEvents);
    if (params && params.all) {
      payload['all'] = true;
    }
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getVotingEvent(eventId: string): Observable<VotingEvent> {
    const payload = this.buildPostPayloadForService(ServiceNames.getVotingEvent);
    payload['_id'] = eventId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getVotingEventWithNumberOfCommentsAndVotes(eventId: string): Observable<VotingEvent> {
    const payload = this.buildPostPayloadForService(ServiceNames.getVotingEventWithNumberOfCommentsAndVotes);
    payload['_id'] = eventId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  createVotingEvent(name: string, initiativeName: string, flow?: VotingEventFlow) {
    const payload = this.buildPostPayloadForService(ServiceNames.createVotingEvent);
    payload['name'] = name;
    payload['initiativeName'] = initiativeName;
    payload['flow'] = flow;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return resp;
      }),
      catchError(this.handleError)
    );
  }

  openVotingEvent(id: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.openVotingEvent);
    payload['_id'] = id;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  closeVotingEvent(id: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.closeVotingEvent);
    payload['_id'] = id;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  cancelVotingEvent(_id: string, hard?: boolean) {
    const payload = this.buildPostPayloadForService(ServiceNames.cancelVotingEvent);
    payload['_id'] = _id;
    if (hard) {
      payload['hard'] = hard;
    }
    return this.http.post(this.url, payload).pipe(catchError(this.handleError));
  }

  addTechnologyToVotingEvent(_id: string, technology: Technology) {
    const payload = this.buildPostPayloadForService(ServiceNames.addNewTechnologyToEvent);
    payload['_id'] = _id;
    payload['technology'] = technology;
    return this.http.post(this.url, payload).pipe(catchError(this.handleError));
  }

  addCommentToTech(_id: string, technologyId: string, comment: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.addCommentToTech);
    payload['_id'] = _id;
    payload['technologyId'] = technologyId;
    payload['comment'] = comment;
    return this.http.post(this.url, payload).pipe(catchError(this.handleError));
  }

  addReplyToTechComment(votingEventId: string, technologyId: string, reply: Comment, commentReceivingReplyId: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.addReplyToTechComment);
    payload['votingEventId'] = votingEventId;
    payload['technologyId'] = technologyId;
    payload['reply'] = reply;
    payload['commentReceivingReplyId'] = commentReceivingReplyId;
    return this.http.post(this.url, payload).pipe(catchError(this.handleError));
  }

  getVoters(votingEvent: VotingEvent) {
    const payload = this.buildPostPayloadForService(ServiceNames.getVoters);
    payload['votingEvent'] = votingEvent;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  authenticate(user: string, pwd: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.authenticate);
    payload['user'] = user;
    payload['pwd'] = pwd;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        const r = this.handleReponseDefault(resp);
        return r;
      }),
      catchError(this.handleError)
    );
  }

  authenticateForVotingEvent(
    user: string,
    pwd: string,
    votingEventId: string,
    flowStepName: string
  ): Observable<{ token: string; pwdInserted: boolean }> {
    const payload = this.buildPostPayloadForService(ServiceNames.authenticateForVotingEvent);
    payload['user'] = user;
    payload['pwd'] = pwd;
    payload['votingEventId'] = votingEventId;
    payload['flowStepName'] = flowStepName;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        const r = this.handleReponseDefault(resp);
        return r;
      }),
      catchError(this.handleError)
    );
  }

  addUsersForVotingEvent(users: { user: string; groups: string[] }[], votingEventId: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.addUsersForVotingEvent);
    payload['users'] = users;
    payload['votingEventId'] = votingEventId;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        const r = this.handleReponseDefault(resp);
        return r;
      }),
      catchError(this.handleError)
    );
  }

  deleteUsers(users: string[]) {
    const payload = this.buildPostPayloadForService(ServiceNames.deleteUsers);
    payload['users'] = users;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        const r = this.handleReponseDefault(resp);
        return r;
      }),
      catchError(this.handleError)
    );
  }

  getConfiguration(user?: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.getConfiguration);
    payload['user'] = user;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  saveLogInfo(reason: string, logInfo: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.saveLogInfo);
    payload['logInfo'] = logInfo;
    payload['reason'] = reason;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  private handleReponseDefault(resp: RespFromBackend) {
    if (resp.error) {
      throw resp.error;
    }
    return resp.data;
  }

  private handleError(error: any) {
    let _err;
    let errorMessage = 'Something bad happened; please try again later. You may take a look at the browser console to get a hint.';
    if (error.status === 0) {
      logError('Server is unreacheable ...');
      logError('The error details: ' + inspect(error));
      return throwError({ message: 'Server is unreacheable ...', errorCode: ERRORS.serverUnreacheable });
    } else if (error.status === 401) {
      logError('Unauthorized');
      logError('The error details: ' + inspect(error));
      return throwError({ message: `Unauthorized - error ${JSON.stringify(error.error)}`, errorCode: ERRORS.unauthorized });
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = 'An error occurred: ' + error.error.message;
      logError(errorMessage);
      _err = errorMessage;
    }
    // an error with 'errorCode' is an error raised from our application logic
    else if (error.errorCode) {
      errorMessage = 'An error occurred: ' + error.message;
      if (error.serviceName) {
        errorMessage = errorMessage + ' on service ' + error.serviceName;
      }
      logError(errorMessage);
      _err = error;
    }
    // if the error contains a message and a stack than it comes from the backend
    else if (error.message && error.stack) {
      errorMessage = 'An error on the backend occurred: ' + error.message;
      if (error.serviceName) {
        errorMessage = errorMessage + ' on service ' + error.serviceName;
      }
      errorMessage = errorMessage + '\n' + 'STACK TRACE' + '\n' + error.stack;
      logError(errorMessage);
      _err = errorMessage;
    } else if (error.message) {
      errorMessage = 'An error occurred: ' + error.message;
      if (error.serviceName) {
        errorMessage = errorMessage + ' on service ' + error.serviceName;
      }
      logError(errorMessage);
      _err = errorMessage;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error)}`;
      logError(errorMessage);
      _err = errorMessage;
    }
    // tslint:disable-next-line:no-console
    // logErrortrace();
    // return an ErrorObservable with a user-facing error message
    return throwError(_err);
  }

  private buildPostPayloadForService(serviceName: ServiceNames) {
    const service = ServiceNames[serviceName];
    return { service };
  }

  getBlipsForSelectedEvent(votingEvent: VotingEvent, config: any) {
    const subtitle = config.siteName || this.defaultSiteName;
    const backendUrlWithParams = encodeURIComponent(
      this.url + 'votes/' + votingEvent._id + '/blips.csv?thresholdForRevote=' + config.thresholdForRevote + '&type=csv'
    );
    const radarUrl = environment.radarURL + '?title=' + votingEvent.name + '&subtitle=' + subtitle + '&sheetId=' + backendUrlWithParams;
    window.open(radarUrl, '_blank');
  }

  getBlipsForAllEvent(config: any) {
    const title = config.siteName || this.defaultSiteName;
    const backendUrlWithParams = encodeURIComponent(
      this.url + 'votes/blips.csv?serviceUrl=' + this.url + '&radarUrl=' + environment.radarURL + '&type=csv'
    );
    const radarURL = environment.radarURL + '?title=' + title + '&sheetId=' + backendUrlWithParams;
    window.open(radarURL, '_blank');
  }

  techForRevote(votingEvent: VotingEvent, config: any) {
    const subtitle = config.siteName || this.defaultSiteName;
    const backendUrlWithParams = encodeURIComponent(
      this.url + 'votes/' + votingEvent._id + '/revote/blips.csv?thresholdForRevote=' + config.thresholdForRevote + '&type=csv'
    );
    const radarUrl = environment.radarURL + '?title=' + votingEvent.name + '&subtitle=' + subtitle + '&sheetId=' + backendUrlWithParams;
    window.open(radarUrl, '_blank');
  }

  moveToNexFlowStep(id: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.moveToNexFlowStep);
    payload['_id'] = id;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  setRecommendationAuthor(votingEventId: string, technologyName: string, author: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.setRecommendationAuthor);
    payload['votingEventId'] = votingEventId;
    payload['technologyName'] = technologyName;
    payload['author'] = author;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  setRecommendation(votingEventId: string, technologyName: string, recommendation: Recommendation) {
    const payload = this.buildPostPayloadForService(ServiceNames.setRecommendation);
    payload['votingEventId'] = votingEventId;
    payload['technologyName'] = technologyName;
    payload['recommendation'] = recommendation;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  resetRecommendation(votingEventId: string, technologyName: string, requester: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.resetRecommendation);
    payload['votingEventId'] = votingEventId;
    payload['technologyName'] = technologyName;
    payload['requester'] = requester;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getBlipHistoryForTech(techName: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.getBlipHistoryForTech);
    payload['techName'] = techName;
    return this.http.post(this.url, payload).pipe(
      map((resp: any) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  createInitiative(name: string) {
    const payload = this.buildPostPayloadForService(ServiceNames.createInitiative);
    payload['name'] = name;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  cancelInitiative(name: string, hard?: boolean) {
    const payload = this.buildPostPayloadForService(ServiceNames.cancelInitiative);
    payload['name'] = name;
    if (hard) {
      payload['hard'] = hard;
    }
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }

  getInitiatives() {
    const payload = this.buildPostPayloadForService(ServiceNames.getInitiatives);
    payload['name'] = name;
    return this.http.post(this.url, payload).pipe(
      map((resp: RespFromBackend) => {
        return this.handleReponseDefault(resp);
      }),
      catchError(this.handleError)
    );
  }
}
