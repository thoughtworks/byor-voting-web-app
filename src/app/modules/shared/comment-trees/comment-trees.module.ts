import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTreeModule } from '@angular/material/tree';

import { CommentTreesComponent } from './comment-trees/comment-trees.component';
import { CommentCardComponent } from './comment-trees/comment-card.component';
import { AppMaterialModule } from 'src/app/app-material.module';

@NgModule({
  declarations: [CommentTreesComponent, CommentCardComponent],
  imports: [AppMaterialModule, CommonModule, MatTreeModule],
  exports: [CommentTreesComponent, CommentCardComponent]
})
export class CommentTreesModule {}
