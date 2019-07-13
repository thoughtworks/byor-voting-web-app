import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModule } from '../../../../app-material.module';
import { MatTreeModule } from '@angular/material/tree';

import { CommentTreesComponent } from './comment-trees.component';
import { CommentCardComponent } from './comment-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, asyncScheduler } from 'rxjs';
import { observeOn, skip, take, map, tap } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { VoteService } from '../../../vote/services/vote.service';
import { Vote } from 'src/app/models/vote';
import { AppSessionService } from 'src/app/app-session.service';
import { Technology } from 'src/app/models/technology';
import { VotingEvent } from 'src/app/models/voting-event';
import { RouterTestingModule } from '@angular/router/testing';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { MockVoteService, TEST_TECHNOLOGY } from 'src/app/modules/test-mocks/mock-vote-service';
import { MockBackEndService } from 'src/app/modules/test-mocks/mock-back-end-service';

const firsCommentId = 'firsCommentId';
const replyToFirsCommentId = 'replyToFirsCommentId';
const secondReplyToReplyToFirsCommentId = 'replyToReplyToFirsCommentId';

const votes: Vote[] = [
  {
    technology: TEST_TECHNOLOGY,
    ring: 'adopt',
    comment: {
      text: 'first comment',
      id: firsCommentId,
      author: 'Auth 1',
      timestamp: '2019-06-12T17:36:19.281Z',
      replies: [
        {
          text: 'first reply to first comment',
          id: 'replyToFirsCommentId',
          author: 'Auth 1.1',
          timestamp: '2019-06-12T17:46:19.281Z',
          replies: [
            {
              text: 'first reply to first first reply to first comment',
              id: '1.1.1',
              author: 'Auth 1.1.1',
              timestamp: '2019-06-12T17:47:19.281Z'
            },
            {
              text: 'second reply to first first reply to first comment',
              id: secondReplyToReplyToFirsCommentId,
              author: 'Auth 1.1.2',
              timestamp: '2019-06-12T17:47:29.281Z'
            }
          ]
        }
      ]
    }
  }
];

const mockBackendService = new MockBackEndService();
mockBackendService.votes = votes;

describe('CommentTreesComponent', () => {
  let component: CommentTreesComponent;
  let fixture: ComponentFixture<CommentTreesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentTreesComponent, CommentCardComponent],
      imports: [AppMaterialModule, RouterTestingModule, MatTreeModule, HttpClientTestingModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        { provide: VoteService, useClass: MockVoteService },
        { provide: AppSessionService, useClass: MockAppSessionService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('find the parent nodes nodes from a node up to the top node', () => {
    // _flattenedData emits when the dataSource generates a new set of flattened data
    // at the second notification of this Observable we are sure that 'flatNodeMap' map
    // of the ConversationComponent has been filled with the execution of 'transformer' method of ConversationComponent
    // when 'flatNodeMap' is filled with data, the idsUpToFather method can work
    component.dataSource._flattenedData
      .pipe(
        skip(1), // ignore the first notification which is emitted when the data of the data source is empty
        take(1), // at the second emission 'flatNodeMap' has been filled by 'transform' method of ConversationComponent
        map(() => component.idsUpToFather(secondReplyToReplyToFirsCommentId)),
        tap((nodeIds) => {
          expect(nodeIds.length).toBe(2);
          expect(nodeIds[0]).toBe(replyToFirsCommentId);
          expect(nodeIds[1]).toBe(firsCommentId);
        })
      )
      .subscribe();
  });
});
