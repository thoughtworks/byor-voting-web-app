import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { merge, Subscription } from 'rxjs';

import { TechnologyListService } from '../../technology-list/services/technology-list.service';
import { AppSessionService } from 'src/app/app-session.service';
import { Technology } from 'src/app/models/technology';

@Component({
  selector: 'byor-select-tech-for-conversation',
  templateUrl: './select-tech-for-conversation.component.html',
  styleUrls: ['./select-tech-for-conversation.component.scss']
})
export class SelectTechForConversationComponent implements OnInit, OnDestroy {
  technologyListSubscription: Subscription;

  constructor(private router: Router, private technologyListService: TechnologyListService, private appSession: AppSessionService) {}

  ngOnInit() {
    this.technologyListSubscription = merge(this.technologyListService.technologySelected$).subscribe((tech) =>
      this.goToConversation(tech)
    );
  }
  ngOnDestroy() {
    if (this.technologyListSubscription) {
      this.technologyListSubscription.unsubscribe();
    }
  }

  goToConversation(technology: Technology) {
    this.appSession.setSelectedTechnology(technology);
    this.router.navigate(['vote/conversation']);
  }
}
