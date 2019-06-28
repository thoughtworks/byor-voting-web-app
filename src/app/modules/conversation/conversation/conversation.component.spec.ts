import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModule } from '../../../app-material.module';
import { MatTreeModule } from '@angular/material/tree';

import { ConversationComponent, CommentWithVoteIdNode } from './conversation.component';
import { CommentCardComponent } from './comment-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, asyncScheduler } from 'rxjs';
import { observeOn, skip, take, map, tap } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
import { VoteService } from '../../vote/services/vote.service';
import { Vote } from 'src/app/models/vote';

const TEST_TECHNOLOGIES = [
  {
    id: '0001',
    name: 'Babel',
    quadrant: 'tools',
    isnew: true,
    description: 'Description of <strong>Babel</strong>'
  },
  {
    id: '0002',
    name: 'Ember.js',
    quadrant: 'languages & frameworks',
    isnew: true,
    description: 'Description of <strong>Ember.js</strong>'
  },
  {
    id: '0003',
    name: 'Docker',
    quadrant: 'platforms',
    isnew: false,
    description: 'Description of <strong>Docker</strong>'
  },
  {
    id: '0004',
    name: 'Consumer-driven contract testing',
    quadrant: 'techniques',
    isnew: true,
    description: 'Description of <strong>Consumer-driven contract testin</strong>'
  },
  {
    id: '0005',
    name: 'LambdaCD',
    quadrant: 'tools',
    isnew: true,
    description: 'Description of <strong>LambdaCD</strong>'
  }
];

const TEST_TECHNOLOGY = {
  id: '0001',
  name: 'Babel',
  quadrant: 'tools',
  isnew: true,
  description: 'Description of <strong>Babel</strong>'
};

const firsCommentId = 'firsCommentId';
const replyToFirsCommentId = 'replyToFirsCommentId';
const secondReplyToReplyToFirsCommentId = 'replyToReplyToFirsCommentId';
class MockBackEndService {
  votes: Vote[] = [
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
  getVotesWithCommentsForTechAndEvent() {
    return of(this.votes).pipe(observeOn(asyncScheduler));
  }
}
class MockVoteService {
  credentials;
  technology = TEST_TECHNOLOGY;

  constructor() {
    this.credentials = {
      voterId: null,
      votingEvent: { technologies: TEST_TECHNOLOGIES, name: null, status: 'closed', _id: null, creationTS: null }
    };
  }
}

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationComponent, CommentCardComponent],
      imports: [AppMaterialModule, MatTreeModule, HttpClientTestingModule],
      providers: [{ provide: BackendService, useClass: MockBackEndService }, { provide: VoteService, useClass: MockVoteService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationComponent);
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
