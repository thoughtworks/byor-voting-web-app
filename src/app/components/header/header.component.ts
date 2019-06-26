import { Component, OnInit } from '@angular/core';
import { Observable, never } from 'rxjs';
import { shareReplay, tap, map, switchMap, catchError, } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'byor-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  configuration$: Observable<any>;

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit() {

    this.configuration$ = this.configurationService.defaultConfiguration()
      .pipe(
        shareReplay(1)
      );
  }

}
