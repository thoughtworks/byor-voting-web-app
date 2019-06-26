import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, timer } from 'rxjs';
import { Blip } from '../../../models/blip';
import { BackendService } from '../../../services/backend.service';
import { VotingEvent } from '../../../models/voting-event';

export interface VotesCount {
  name: string;
  quadrant: string;
  votes: number;
}

@Injectable({
  providedIn: 'root'
})
export class VoteCloudService {
  constructor(private backendService: BackendService) {}

  event: VotingEvent;

  public setVotingEvent(votingEvent: VotingEvent) {
    this.event = votingEvent;
  }

  public getVotingEvent() {
    return this.event;
  }

  public vote(selectedRing$: Observable<string>): Observable<VotesCount[]> {
    const votes$ = timer(0, 10000)
      .pipe(
        switchMap(() => {
          if (this.event) {
            return this.backendService.calculateBlips(this.event);
          }
          return this.backendService.calculateBlipsFromAllEvents();
        })
      );

    return combineLatest([selectedRing$, votes$])
      .pipe(
        map(([selectedRing, blips]) => {
            return this.buildCloudData(blips, selectedRing);
          }
        ));
  }

  buildCloudData(blips: Array<Blip>, selectedRing: string): VotesCount[] {
    const newBlips = [];

    blips.forEach(blip => {
      if (!selectedRing || selectedRing === 'none') {
        newBlips.push({
          name: blip.name,
          quadrant: blip.quadrant,
          votes: blip.numberOfVotes
        });
      } else {

        const votesForRing = blip.votes.find(vfr => vfr.ring === selectedRing);
        if (votesForRing) {
          // Add to list only if the votes for ring are found
          newBlips.push({
            name: blip.name,
            quadrant: blip.quadrant,
            votes: votesForRing.count
          });
        }
      }
    });

    return newBlips;
  }
}
