import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Technology } from 'src/app/models/technology';

@Injectable()
export class TechnologyListService {
  technologySelected$ = new Subject<Technology>();
  newTechnologyAdded$ = new Subject<Technology>();
  technologies$: Observable<Technology[]>;
}
