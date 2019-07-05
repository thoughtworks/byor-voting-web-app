import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'byor-comment-card',
  template: `
    <mat-card class="comment-card">
      <mat-card-title>{{ title }}</mat-card-title>
      <mat-card-subtitle>{{ timestamp }}</mat-card-subtitle>
      <mat-card-content>{{ text }}</mat-card-content>
      <mat-card-actions *ngIf="showAddReplyButton">
        <button mat-icon-button (click)="addNewItem()"><mat-icon>add</mat-icon></button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./conversation.component.scss'],
  styles: []
})
export class CommentCardComponent {
  @Input() title: string;
  @Input() timestamp: string;
  @Input() text: string;
  @Input() showAddReplyButton: boolean;
  @Output() addNewItemClicked = new EventEmitter<any>();

  addNewItem() {
    this.addNewItemClicked.next();
  }
}
