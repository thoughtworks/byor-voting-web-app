import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, fromEvent, concat, of, Subject, merge, EMPTY, Subscription } from 'rxjs';
import { map, catchError, switchMap, scan, shareReplay, delay, tap, concatMap } from 'rxjs/operators';

import { BackendService } from '../../../services/backend.service';
import { ErrorService } from '../../../services/error.service';
import { Technology } from '../../../models/technology';
import { QUADRANT_NAMES } from '../../../models/quadrant';
import { VoteService } from '../../vote/services/vote.service';
import * as _ from 'lodash';
import { TwRings } from 'src/app/models/ring';
import { logError } from 'src/app/utils/utils';
import { AppSessionService } from 'src/app/app-session.service';
import { getActionName, getAction } from 'src/app/utils/voting-event-flow.util';
import { TechnologyListService } from '../services/technology-list.service';

@Component({
  selector: 'byor-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrls: ['./technology-list.component.scss']
})
export class TechnologyListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchField') searchField: ElementRef;
  quadrants = QUADRANT_NAMES;
  rings = TwRings.names;

  private technologiesToShowSubscription: Subscription;
  technologiesToShow: Technology[];

  search$: Observable<any>;
  clearSearch$ = new Subject<any>();
  quadrantSelected$ = new BehaviorSubject<string>('');
  // the following Observable emits the name of the quadrant selected if it is different from the last quadrant selected,
  // otherwise, if it is the same value as the last one selected, it emits an empty string
  // this is to implement a toggle mechanism, so that if you click twice on the same button, the first time it emits
  // the name of the quadrant associated to the button while the second time it emits the empty string - the third time it
  // would emit again the name of the quadrant
  // via this mechanims we can avoid defining a Class variable to hold the state of the "selected button" and we keep
  // the implementation stateless - to be understood whether this makes it simpler
  quadrantSelectedToggle$ = this.quadrantSelected$.pipe(
    scan((currentQuadrant, quadrant) => {
      return currentQuadrant === quadrant ? '' : quadrant;
    }),
    // shareReplay(1) is important since this Observable is used with 2 subscriptions: one to support the filtering
    // and one to support the highlight of the selected quadrant button with toggling
    shareReplay(1)
  );
  private technolgiesToExclude$ = new BehaviorSubject<Technology[]>([]);
  @Input('technolgiesToExclude')
  set technolgiesToExclude(technologies: Technology[]) {
    this.setTechnolgiesToExclude(technologies);
  }

  votingEventId$: Observable<any>;

  constructor(
    private backEnd: BackendService,
    private router: Router,
    private errorService: ErrorService,
    private voteService: VoteService,
    private appSession: AppSessionService,
    private techListService: TechnologyListService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.search$ = merge(concat(of(''), fromEvent(this.searchField.nativeElement, 'keyup')), this.clearSearch$).pipe(
      map(() => this.searchField.nativeElement.value)
    );
    this.technologiesToShowSubscription = this.techonologiesToShow().subscribe((t) => {
      this.technologiesToShow = t;
    });
  }
  ngOnDestroy() {
    if (!!this.technologiesToShowSubscription) {
      this.technologiesToShowSubscription.unsubscribe();
    }
  }

  techonologiesToShow() {
    let technologies: Array<Technology>;
    return this.getTechnologies().pipe(
      tap((techs) => (technologies = techs)),
      switchMap(() => {
        return combineLatest([this.search$, this.quadrantSelectedToggle$, this.technolgiesToExclude$]);
      }),
      // delay is needed to avoid the error ExpressionChangedAfterItHasBeenCheckedError
      // @todo see if it is possible to remove delay
      delay(0),
      // show in the list only the technologies serach criteria and quadrant selected
      map(([search, quadrant, technolgiesToExclude]) => {
        return technologies
          .filter((technology) => search === '' || technology.name.toLowerCase().includes(search.toLowerCase()))
          .filter((technology) => quadrant === '' || technology.quadrant.toLowerCase() === quadrant.toLowerCase())
          .filter((technology) => !technolgiesToExclude.includes(technology));
      }),
      catchError((err) => {
        logError(err);
        this.router.navigate(['/error']);
        this.errorService.setError(err);
        return EMPTY;
      })
    );
  }

  setTechnolgiesToExclude(technoogies: Technology[]) {
    this.technolgiesToExclude$.next(technoogies);
  }

  getTechnologies() {
    // @todo remove "|| this.voteService.credentials.votingEvent" once the enableVotingEventFlow toggle is removed
    const votingEvent = this.appSession.getSelectedVotingEvent() || this.voteService.credentials.votingEvent;

    const actionParams = getAction(votingEvent).parameters;
    const getVotingEventObs =
      actionParams && actionParams.displayVotesAndCommentNumbers
        ? this.backEnd.getVotingEventWithNumberOfCommentsAndVotes(votingEvent._id)
        : this.backEnd.getVotingEvent(votingEvent._id);
    return getVotingEventObs.pipe(
      map((event) => {
        const technologies = event.technologies;
        return _.sortBy(technologies, function(item: Technology) {
          return item.name.toLowerCase();
        });
      })
    );
  }

  technologySelected(technology: Technology) {
    const votingEventRound = this.appSession.getSelectedVotingEvent().round;
    this.appSession.setSelectedTechnology(technology);
    const actionName = getActionName(this.appSession.getSelectedVotingEvent());
    this.techListService.technologySelected$.next(technology);
  }

  createNewTechnology(name: string, quadrant: string) {
    const votingEvent = this.appSession.getSelectedVotingEvent();
    const technology: Technology = {
      name: name,
      isnew: true,
      description: '',
      quadrant: quadrant
    };
    this.backEnd
      .addTechnologyToVotingEvent(votingEvent._id, technology)
      .pipe(concatMap(() => this.getTechnologies()))
      .subscribe((resp) => {
        this.techListService.newTechnologyAdded$.next(technology);
      });
  }

  goToConversation(technology: Technology) {
    this.appSession.setSelectedTechnology(technology);
    this.router.navigate(['vote/conversation']);
  }

  clearSearch() {
    this.searchField.nativeElement.value = '';
    this.clearSearch$.next('');
  }

  quadrantSelected(quadrant: string) {
    this.quadrantSelected$.next(quadrant);
  }
  isQuadrantSelected(quadrant: string) {
    return this.quadrantSelectedToggle$.pipe(map((q) => q === quadrant));
  }

  truncatedName(name: string) {
    const maxLength = 30;
    let shortName = name;
    if (name.length > maxLength) {
      shortName =
        _(name.substring(0, maxLength).split(' '))
          .tap(function(array) {
            array.pop();
          })
          .join(' ') + '...';
    }
    return shortName;
  }
}
