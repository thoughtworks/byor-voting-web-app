import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from './app.component';
import { AppSessionService } from './app-session.service';
import { VoteService } from './modules/vote/services/vote.service';

@Injectable()
export class CanActivateStart implements CanActivate {
  public constructor(private _router: Router, private appSession: AppSessionService, private voteService: VoteService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const votingEvent = this.appSession.getSelectedVotingEvent();
    if (!votingEvent && !(route.parent.component === AppComponent)) {
      this._router.navigateByUrl('/refresh');
    }
    return true;
  }
}
