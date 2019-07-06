import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material.module';

import { TechnologyListComponent } from './technology-list/technology-list.component';
import { TechnologyListService } from './services/technology-list.service';

@NgModule({
  declarations: [TechnologyListComponent],
  imports: [CommonModule, AppMaterialModule],
  providers: [TechnologyListService],
  exports: [TechnologyListComponent]
})
export class TechnologyListModule {}
