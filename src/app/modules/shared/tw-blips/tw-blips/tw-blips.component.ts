import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';
import { Blip } from 'src/app/models/blip';

@Component({
  selector: 'byor-tw-blips',
  templateUrl: './tw-blips.component.html',
  styleUrls: ['./tw-blips.component.scss']
})
export class TwBlipsComponent implements OnInit {
  blips$: Observable<Blip[]>;

  constructor(public appSession: AppSessionService, private backEnd: BackendService) {}

  ngOnInit() {
    this.blips$ = this.appSession.selectedTechnology$.pipe(switchMap((tech) => this.backEnd.getBlipHistoryForTech(tech.name)));
  }
}
