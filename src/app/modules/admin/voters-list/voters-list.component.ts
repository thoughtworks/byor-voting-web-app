import { Component, AfterViewInit, } from '@angular/core';
import { Observable, Subject, } from 'rxjs';
import { map, shareReplay, switchMap, scan, share, } from 'rxjs/operators';

import { EventsService } from '../../../services/events.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'byor-voters-list',
  templateUrl: './voters-list.component.html',
  styleUrls: ['./voters-list.component.scss']
})
export class VotersListComponent implements AfterViewInit {

  voters$: Observable<Array<string>>;
  winners$: Observable<string>;
  nextWinner$ = new Subject<any>();

  constructor(
    private eventsService: EventsService,
    private backend: BackendService,
  ) { }

  ngAfterViewInit() {
    this.voters$ = this.backend.getVoters(this.eventsService.getSelectedEvent())
      .pipe(
        map(voters => voters.sort()),
        shareReplay(1)
      );

    this.winners$ = this.voters$
      .pipe(
        map(voters => [...voters]),
        switchMap(
          votersCopy => this.nextWinner$
            .pipe(
              map(() => {
                if (votersCopy.length > 0) {
                  const { winner, randomVoterIndex: randomWinnerIndex } = this.getRandomVoter(votersCopy);
                  votersCopy.splice(randomWinnerIndex, 1);
                  return winner;
                }
                return null;
              })
            )
        ),
        scan((winners: any, nextWinner) => {
          if (nextWinner) {
            winners.push(nextWinner);
          }
          return winners;
        }, []),
        // you need to share in order to avoid the creation of different subscriptions and therefore different instances of
        // 'votersCopy' variable
        share(),
      );
  }

  getWinner() {
    this.nextWinner$.next();
  }
  private getRandomVoter(voters: Array<string>) {
    const numberOfVoters = voters.length;
    const randomVoterIndex = Math.floor(Math.random() * numberOfVoters);
    const winner = voters[randomVoterIndex];
    return { winner, randomVoterIndex };
  }

}
