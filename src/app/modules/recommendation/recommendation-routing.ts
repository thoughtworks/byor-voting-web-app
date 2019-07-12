import { Routes } from '@angular/router';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { CanActivateStart } from '../../can-activate-start';

import { SelectTechForRecommendationComponent } from './select-tech-for-recommendation/select-tech-for-recommendation.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateStart],
    children: [
      { path: '', component: SelectTechForRecommendationComponent },
      { path: 'recommendation', component: RecommendationComponent }
    ]
  }
];
