import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceNames } from './service-names';
import { HandleError, HttpErrorHandler } from '../shared/http-error-handler/http-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private error$ = new BehaviorSubject<Error>(new Error('Unknown Error - try to check on the browser console for more details'));

  private readonly handleError: HandleError;
  private defaultMessage = 'Something went wrong; Please try again';

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ErrorsService');
  }

  private errorMessage: string;

  getError() {
    return this.error$.asObservable();
  }
  setError(error: Error) {
    this.error$.next(error);
  }

  setErrorMessage(error: Error) {
    if (error.message) {
      this.errorMessage = error.message;
    }

    this.errorMessage = "Error occurred, please try again"
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  saveErrorInfo(reason: string, logInfo: string) {
    const payload = {
      service: ServiceNames[ServiceNames.saveLogInfo],
      logInfo: logInfo,
      reason: reason,
    };

    this.http
      .post(environment.serviceUrl, payload)
      .pipe(
        catchError(this.handleError<string>(this.defaultMessage)),
      ).subscribe();
  }

  getErrorMessageHtml() {
    return this.error$
    .pipe(
      map(e => {
        if (e.message) {
          return e.message;
        }
        return e;
      })
    );
  }

}
