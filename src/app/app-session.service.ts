import { Injectable } from '@angular/core';
import { VotingEvent } from 'src/app/models/voting-event';
import { Technology } from './models/technology';
import { Credentials } from './models/credentials';

@Injectable({
  providedIn: 'root'
})
export class AppSessionService {
  private votingEvents: VotingEvent[];
  private selectedVotingEvent: VotingEvent;
  private selectedTechnology: Technology;
  private credentials: Credentials;

  constructor() {}

  getVotingEvents() {
    return this.votingEvents;
  }
  setVotingEvents(votingEvents: VotingEvent[]) {
    this.votingEvents = votingEvents;
  }

  getSelectedVotingEvent() {
    return this.selectedVotingEvent;
  }
  setSelectedVotingEvent(votingEvent: VotingEvent) {
    this.selectedVotingEvent = votingEvent;
  }

  getSelectedTechnology() {
    return this.selectedTechnology;
  }
  setSelectedTechnology(technology: Technology) {
    this.selectedTechnology = technology;
  }

  getCredentials() {
    return this.credentials;
  }
  setCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }
}
