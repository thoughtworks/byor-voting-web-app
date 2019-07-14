import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyVotingResultComponent } from './technology-voting-result/technology-voting-result.component';
import { AppMaterialModule } from 'src/app/app-material.module';

@NgModule({
  declarations: [TechnologyVotingResultComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [TechnologyVotingResultComponent]
})
export class TechnologyVotingResultsModule {}
