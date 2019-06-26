import { TestBed } from '@angular/core/testing';

import { HttpErrorHandler } from './http-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HttpErrorHandler', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [HttpErrorHandler]
  }));

  it('should be created', () => {
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    expect(service).toBeTruthy();
  });

  it('handles client side errors', () => {
    let returnedValue = '';
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    const handler = service.handleError('Test', 'Dummy default data');

    const errEvent: ErrorEvent = document.createEvent('ErrorEvent');
    const httpErrorRes = new HttpErrorResponse({ error: errEvent });
    handler(httpErrorRes).subscribe(value => {
      returnedValue = value;
    });

    expect(returnedValue).toBe('Dummy default data');
  });

  it('handles backend errors', () => {
    let returnedValue = '';
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    const handler = service.handleError('Test', 'Dummy default data');

    const httpErrorRes = new HttpErrorResponse({});
    handler(httpErrorRes).subscribe(value => {
      returnedValue = value;
    });

    expect(returnedValue).toBe('Dummy default data');
  });

  it('creates a handler', () => {
    let returnedValue = '';
    const service: HttpErrorHandler = TestBed.get(HttpErrorHandler);
    const handler = service.createHandleError('Test')('Dummy default data');

    const httpErrorRes = new HttpErrorResponse({});
    handler(httpErrorRes).subscribe(value => {
      returnedValue = value;
    });

    expect(returnedValue).toBe('Dummy default data');
  });
});
