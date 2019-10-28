import { Injectable } from '@angular/core';

import { BackendService } from './backend.service';
import { ReplaySubject, Subject, merge } from 'rxjs';
import { Technology } from '../models/technology';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VotingEventService {
  private _technologies: Technology[];
  private readonly _technologies$ = new ReplaySubject<Technology[]>(1);
  private readonly _newTechnologyAdded$ = new Subject<Technology>();

  // public Observable properties which are APIs of the service
  technologies$ = this._technologies$.asObservable();
  quadrants$ = this.technologies$.pipe(
    map((techs) => techs.map((t) => t.quadrant.toUpperCase())),
    map((quadrants) => {
      const uniqueQuadrantNamesSet = new Set(quadrants);
      const uniqueQuadrantNames = new Array<string>();
      uniqueQuadrantNamesSet.forEach((q) => uniqueQuadrantNames.push(q));
      return uniqueQuadrantNames;
    })
  );
  newTechnologyAdded$ = this._newTechnologyAdded$.asObservable();

  constructor(private backEnd: BackendService) {}

  getVotingEvent(id: string) {
    return this.backEnd.getVotingEvent(id).pipe(
      tap((votingEvent) => {
        this._technologies = votingEvent.technologies;
        this._technologies$.next(this._technologies);
      })
    );
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

  addTechnologyToVotingEvent(votingEventId: string, technology: Technology) {
    return this.backEnd.addTechnologyToVotingEvent(votingEventId, technology).pipe(tap((resp) => this.addNewTechnology(resp.data)));
  }
}
