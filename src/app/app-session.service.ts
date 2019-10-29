import { ReplaySubject } from 'rxjs';

import { Injectable } from '@angular/core';
import { VotingEvent } from 'src/app/models/voting-event';
import { Technology } from './models/technology';
import { Credentials } from './models/credentials';
import { Initiative } from './models/initiative';

@Injectable({
  providedIn: 'root'
})
export class AppSessionService {
  private votingEvents: VotingEvent[];
  private selectedInitiative: Initiative;
  private selectedTechnology: Technology;
  selectedTechnology$ = new ReplaySubject<Technology>(1);
  private credentials: Credentials;

  constructor() {}

  getVotingEvents() {
    return this.votingEvents;
  }
  setVotingEvents(votingEvents: VotingEvent[]) {
    this.votingEvents = votingEvents;
  }

  getSelectedTechnology() {
    return this.selectedTechnology;
  }
  setSelectedTechnology(technology: Technology) {
    this.selectedTechnology = technology;
    this.selectedTechnology$.next(technology);
  }

  getCredentials() {
    return this.credentials;
  }
  setCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }

  getSelectedInitiative() {
    return this.selectedInitiative;
  }
  setSelectedInitiative(initiative: Initiative) {
    this.selectedInitiative = initiative;
  }
}
