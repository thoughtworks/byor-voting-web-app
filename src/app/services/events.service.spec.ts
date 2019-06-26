import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { HttpErrorHandler } from '../shared/http-error-handler/http-error-handler.service';
import { environment } from '../../environments/environment';
import { VotingEvent } from '../models/voting-event';

describe('EventsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const url = environment.serviceUrl;

  const eventId = 'myEventId';
  const eventName = 'myEvent';
  const myEvent: VotingEvent = {
    _id: eventId,
    name: eventName,
    status: 'open',
    creationTS: '2019-03-30T14:59:18.334Z',
    round: 2,
  };
  const response = { data: myEvent };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [EventsService, HttpErrorHandler]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('sets and gets the selected event', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.setSelectedEvent(myEvent);

    expect(service.getSelectedEvent()).toEqual(myEvent);
  });

  it('fetches the Voting Event', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.fetchVotingEvent(eventId).subscribe(
      event => expect(event.name).toEqual(eventName),
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('getVotingEvent');
    expect(req.request.body._id).toEqual(eventId);

    req.flush(response);
  });

  it('gets all the events', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.getEvents().subscribe(
      event => expect(event[0].name).toEqual(eventName),
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('getVotingEvents');

    req.flush({data: [myEvent]});
  });

  it('creates the events for voting', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.createVotingEvent('myEvent').subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('createVotingEvent');
    expect(req.request.body.name).toEqual('myEvent');

    req.flush(response);
  });

  it('opens the events for voting', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.openVotingEvent(eventId).subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('openVotingEvent');
    expect(req.request.body._id).toEqual(eventId);

    req.flush(response);
  });

  it('closes the events for voting', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.closeVotingEvent(eventId).subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('closeVotingEvent');
    expect(req.request.body._id).toEqual(eventId);

    req.flush(response);
  });

  it('cancels the events', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.cancelVotingEvent(eventName).subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('cancelVotingEvent');
    expect(req.request.body.name).toEqual(eventName);
    expect(req.request.body.hard).toEqual(false);

    req.flush(response);
  });

  it('opens the events for revote', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.openForRevote(myEvent).subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('openForRevote');
    expect(req.request.body._id).toEqual(eventId);
    expect(req.request.body.round).toEqual(2);

    req.flush(response);
  });

  it('closes the events for revote', () => {
    const service: EventsService = TestBed.get(EventsService);

    service.closeForRevote(myEvent).subscribe(
      (event: any) => { expect(event.name).toEqual(eventName);},
      fail
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.service).toEqual('closeForRevote');
    expect(req.request.body._id).toEqual(eventId);

    req.flush(response);
  });
});
