import { Injectable } from '@angular/core';

import {BackendService} from '../services/backend.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private defaultConfiguration$: Observable<any>;
  private usersConfigurations$ = new Map<string, Observable<any>>();

  constructor(
    private backend: BackendService,
  ) { }

  defaultConfiguration() {
    if (!this.defaultConfiguration$) {
      this.defaultConfiguration$ = this.backend.getConfiguration()
      .pipe(
        shareReplay(1)
      );
    }
    return this.defaultConfiguration$;
  }
  configurationForUser(user: string) {
    if (!this.usersConfigurations$.get(user)) {
      const userConfig$ = this.backend.getConfiguration(user)
      .pipe(
        shareReplay(1)
      );
      this.usersConfigurations$.set(user, userConfig$);
    }
    return this.usersConfigurations$.get(user);
  }
  
}
