import { Injectable } from '@angular/core';

import { BackendService } from './backend.service';
import { ReplaySubject, Subject, merge } from 'rxjs';
import { Technology } from '../models/technology';
import { map, tap, filter, switchMap, take } from 'rxjs/operators';
import { VotingEvent } from '../models/voting-event';

@Injectable({
  providedIn: 'root'
})
export class VotingEventService {
  private _votingEvent: VotingEvent;
  private readonly _votingEvent$ = new ReplaySubject<VotingEvent>(1);
  private _technologies: Technology[];
  private readonly _technologies$ = new ReplaySubject<Technology[]>(1);
  private readonly _newTechnologyAdded$ = new Subject<Technology>();

  // public Observable properties which are APIs of the service
  votingEvent$ = this._votingEvent$.asObservable();
  technologies$ = this._technologies$.asObservable();
  quadrants$ = this.technologies$.pipe(
    // add filter to filter the cases when the technologies are null due to the fact that the VotingEvent passed to
    // setVotingEvent method has been read in a skinny mode and therefore does not contain the technologies
    filter((techs) => !!techs),
    map((techs) => {
      return techs.map((t) => t.quadrant.toUpperCase());
    }),
    map((quadrants) => {
      const uniqueQuadrantNamesSet = new Set(quadrants);
      const uniqueQuadrantNames = new Array<string>();
      uniqueQuadrantNamesSet.forEach((q) => uniqueQuadrantNames.push(q));
      return uniqueQuadrantNames;
    })
  );
  newTechnologyAdded$ = this._newTechnologyAdded$.asObservable();

  constructor(private backEnd: BackendService) {}

  getVotingEvent$(id: string) {
    return this.backEnd.getVotingEvent(id).pipe(
      tap((votingEvent) => {
        this.setVotingEvent(votingEvent);
      })
    );
  }
  getSelectedVotingEvent$() {
    if (!this._votingEvent) {
      throw new Error(`No Voting Event is set as selected`);
    }
    return this.getVotingEvent$(this._votingEvent._id);
  }
  getSelectedVotingEvent() {
    return this._votingEvent;
  }
  setVotingEvent(votingEvent: VotingEvent) {
    this._votingEvent = votingEvent;
    this._votingEvent$.next(votingEvent);
    this._technologies = votingEvent.technologies;
    this._technologies$.next(this._technologies);
  }

  addTechnologyToVotingEvent$(votingEventId: string, technology: Technology) {
    return this.backEnd.addTechnologyToVotingEvent(votingEventId, technology).pipe(tap((resp) => this.addNewTechnology(resp)));
  }

  private addNewTechnology(tech: Technology) {
    if (!this._technologies) {
      throw new Error(`It is not possible to call addNewTechnology if a voting event has not been first fetched from backend - 
      invoke first the method getVotingEvent and then call addTechnologyToVotingEvent`);
    }
    this._technologies.push(tech);
    this._newTechnologyAdded$.next(tech);
    this._technologies$.next(this._technologies);
  }
}
