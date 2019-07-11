import { Routes } from '@angular/router';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { SelectTechComponent } from '../shared/technology-list/select-tech/select-tech.component';
import { CanActivateStart } from '../../can-activate-start';

export const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateStart],
    children: [{ path: '', component: SelectTechComponent }, { path: 'recommendation', component: RecommendationComponent }]
  }
];
