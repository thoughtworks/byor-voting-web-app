import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { logError } from 'src/app/utils/utils';

export type HandleError = <T>(result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {
  createHandleError = (serviceName = '') => <T>(result = {} as T) => this.handleError(serviceName, result);

  handleError<T>(serviceName = '', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        logError(`An error occurred for ${serviceName} : ${error.error.message}`);
      } else {
        logError(`Backend returned code ${error.status} for ${serviceName}, body was: ${error.error}`);
      }

      return of(result);
    };
  }
}
