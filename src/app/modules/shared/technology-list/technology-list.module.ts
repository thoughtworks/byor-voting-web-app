import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app-material.module';

import { TechnologyListComponent } from './technology-list/technology-list.component';

@NgModule({
  declarations: [TechnologyListComponent],
  imports: [CommonModule, AppMaterialModule],
  providers: [],
  exports: [TechnologyListComponent]
})
export class TechnologyListModule {}
