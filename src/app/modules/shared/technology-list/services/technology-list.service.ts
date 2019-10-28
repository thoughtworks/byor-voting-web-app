import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Technology } from 'src/app/models/technology';
import { map } from 'rxjs/operators';

@Injectable()
export class TechnologyListService {
  technologySelected$ = new Subject<Technology>();
}
