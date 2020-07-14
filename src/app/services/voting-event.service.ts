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

  // the _selectedTechnology$ Observable is modelled with a Subject and not a ReplaySubject
  // the reason is that selectedTechnology$ is subscribed by the containers that contain TechnologyListComponent
  // (i.e. VoteComponent, SelectTechForConversationComponent, SelectTechForRecommendationComponent) and is "nexted"
  // only by logic within TechnologyListComponent.
  // So TechnologyListComponent does next on _selectedTechnology$ and the containers of TechnologyListComponent
  // are responsible to react to this event and go to the respective page, either the vote dialogue or the Conversation or Recommendation
  // page.
  // Since it is a Subject and not a ReplaySubject it does not hold history and therefore it allows the browser back button to work. If
  // you are in the conversation page and you click back, than you enter again the container of the TechnologyListComponent, which
  // subscribes to selectedTechnology$ which has not history. Since selectedTechnology$ has no history, this new subscription has
  // to wait for a new next, i.e. the selection of a technology, to perform its task and navigate to the proper page
  private _selectedTechnology: Technology;
  private readonly _selectedTechnology$ = new Subject<Technology>();

  private readonly _newTechnologyAdded$ = new Subject<Technology>();

  // public Observable properties which are APIs of the service
  votingEvent$ = this._votingEvent$.asObservable();
  technologies$ = this._technologies$.asObservable();
  selectedTechnology$ = this._selectedTechnology$.asObservable();
  quadrants$ = this.technologies$.pipe(
    // add filter to filter the cases when the technologies are null due to the fact that the VotingEvent passed to
    // setVotingEvent method has been read in a skinny mode and therefore does not contain the technologies
    filter((techs) => !!techs),
    map((techs) => {
      return techs.map((t) => t.quadrant);
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

  getSelectedTechnology() {
    return this._selectedTechnology;
  }
  setSelectedTechnology(technology: Technology) {
    this._selectedTechnology = technology;
    this._selectedTechnology$.next(technology);
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
