import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwBlipsComponent } from './tw-blips/tw-blips.component';

@NgModule({
  declarations: [TwBlipsComponent],
  imports: [CommonModule],
  exports: [TwBlipsComponent]
})
export class TwBlipsModule {}
