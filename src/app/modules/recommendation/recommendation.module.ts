import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppMaterialModule } from '../../app-material.module';
import { TechnologyListModule } from '../shared/technology-list/technology-list.module';
import { routes } from './recommendation-routing';

import { RecommendationComponent } from './recommendation/recommendation.component';
import { SelectTechForRecommendationComponent } from './select-tech-for-recommendation/select-tech-for-recommendation.component';

@NgModule({
  declarations: [RecommendationComponent, SelectTechForRecommendationComponent],
  imports: [RouterModule.forChild(routes), CommonModule, AppMaterialModule, TechnologyListModule]
})
export class RecommendationModule {}
