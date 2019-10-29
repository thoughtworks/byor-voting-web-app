import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, fromEvent, concat, of, Subject, merge, EMPTY, Subscription } from 'rxjs';
import { map, catchError, switchMap, scan, shareReplay, tap } from 'rxjs/operators';

import { ErrorService } from '../../../../services/error.service';
import { Technology } from '../../../../models/technology';
import * as _ from 'lodash';
import { TwRings } from 'src/app/models/ring';
import { logError } from 'src/app/utils/utils';
import { AppSessionService } from 'src/app/app-session.service';
import { TechnologyListService } from '../services/technology-list.service';
import { VotingEventService } from 'src/app/services/voting-event.service';
import { getActionParameters } from 'src/app/utils/voting-event-flow.util';

@Component({
  selector: 'byor-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrls: ['./technology-list.component.scss']
})
export class TechnologyListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchField') searchField: ElementRef;
  quadrants = new Array<string>();
  quadrants$: Observable<string[]>;
  rings = TwRings.names;

  private technologiesToShowSubscription: Subscription;
  private addTechnologyToVotingEventSubscription: Subscription;
  private searchSubscription: Subscription;
  technologiesToShow: Technology[];

  search$ = new BehaviorSubject<string>('');
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

  constructor(
    private router: Router,
    private errorService: ErrorService,
    private appSession: AppSessionService,
    private techListService: TechnologyListService,
    private votingEventService: VotingEventService
  ) {}

  ngOnInit() {
    this.quadrants$ = this.votingEventService.quadrants$.pipe(tap((_quadrants) => (this.quadrants = _quadrants)));
    this.technologiesToShowSubscription = this.techonologiesToShow().subscribe((t) => {
      this.technologiesToShow = t;
    });
  }

  ngAfterViewInit() {
    this.searchSubscription = merge(concat(of(''), fromEvent(this.searchField.nativeElement, 'keyup')), this.clearSearch$)
      .pipe(map(() => this.searchField.nativeElement.value))
      .subscribe(this.search$);
  }
  ngOnDestroy() {
    if (!!this.technologiesToShowSubscription) {
      this.technologiesToShowSubscription.unsubscribe();
    }
    if (!!this.addTechnologyToVotingEventSubscription) {
      this.addTechnologyToVotingEventSubscription.unsubscribe();
    }
    if (!!this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  techonologiesToShow() {
    let technologies: Array<Technology>;
    return this.getTechnologies().pipe(
      tap((techs) => (technologies = techs)),
      switchMap(() => {
        return combineLatest([this.search$, this.quadrantSelectedToggle$, this.technolgiesToExclude$]);
      }),
      // show in the list only the technologies serach criteria and quadrant selected
      map(([search, quadrant, technolgiesToExclude]) => {
        return technologies
          .filter((technology) => search === '' || technology.name.toLowerCase().includes(search.toLowerCase()))
          .filter((technology) => quadrant === '' || technology.quadrant.toLowerCase() === quadrant.toLowerCase())
          .filter((technology) => !technolgiesToExclude.find((t) => t.name === technology.name));
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
    return this.votingEventService.technologies$.pipe(
      map((techs) => {
        const technologies = techs;
        return _.sortBy(technologies, function(item: Technology) {
          return item.name.toLowerCase();
        });
      })
    );
  }

  technologySelected(technology: Technology) {
    this.appSession.setSelectedTechnology(technology);
    this.techListService.technologySelected$.next(technology);
  }

  createNewTechnology(name: string, quadrant: string) {
    const votingEvent = this.votingEventService.getSelectedVotingEvent();
    const technology: Technology = {
      name: name,
      isnew: true,
      description: '',
      quadrant: quadrant
    };
    this.addTechnologyToVotingEventSubscription = this.votingEventService
      .addTechnologyToVotingEvent$(votingEvent._id, technology)
      .subscribe();
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

  getClassForQuadrant(quadrant: string) {
    const quadrantIndex = this.quadrants.indexOf(quadrant.toUpperCase());
    return `q${quadrantIndex + 1}`;
  }

  showNumberOfVotes(technology: Technology) {
    return this.votingEventService.votingEvent$.pipe(
      map((votingEvent) => getActionParameters(votingEvent)),
      map((stepParams) => {
        const ret = technology.numberOfVotes > 0 && (!stepParams || !stepParams.hideVotesAndCommentNumbers);
        return ret;
      })
    );
  }
  showNumberOfComments(technology: Technology) {
    return this.votingEventService.votingEvent$.pipe(
      map((votingEvent) => getActionParameters(votingEvent)),
      map((stepParams) => technology.numberOfComments > 0 && (!stepParams || !stepParams.hideVotesAndCommentNumbers))
    );
  }
}
