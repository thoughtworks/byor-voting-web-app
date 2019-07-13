import { Component, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Comment } from 'src/app/models/comment';
import { BackendService } from 'src/app/services/backend.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Vote } from 'src/app/models/vote';
import { AppSessionService } from 'src/app/app-session.service';
import { AuthService } from '../../login/auth.service';

/** Flat comment node with expandable and level information */
export class CommentFlatNode {
  text: string;
  level: number;
  expandable: boolean;
  commentId: string;
  voteId: string;
  voteRing: string;
  author: string;
  timestamp: string;
}
export interface CommentWithVoteIdNode extends Comment {
  voteId?: string;
  voteRing?: string;
  parentCommentId?: string;
}

@Component({
  selector: 'byor-comment-trees',
  templateUrl: './comment-trees.component.html',
  styleUrls: ['./comment-trees.component.scss']
})
export class CommentTreesComponent implements OnDestroy {
  @Input() allowAddComment = true;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CommentFlatNode, CommentWithVoteIdNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<Comment, CommentFlatNode>();

  treeControl: FlatTreeControl<CommentFlatNode>;

  treeFlattener: MatTreeFlattener<Comment, CommentFlatNode>;

  dataSource: MatTreeFlatDataSource<Comment, CommentFlatNode>;

  comments: CommentWithVoteIdNode[];
  triggerCommentRetrieval = new BehaviorSubject<CommentFlatNode>(null);
  commentRetrievalSubscription: Subscription;
  private _showAddReplyButton = true;
  errorMessage: string;

  constructor(private backEnd: BackendService, private authService: AuthService, public appSession: AppSessionService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CommentFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    const tech = this.appSession.getSelectedTechnology();
    const votingEvent = this.appSession.getSelectedVotingEvent();
    this.commentRetrievalSubscription = this.triggerCommentRetrieval
      .pipe(
        switchMap((flatNode) =>
          this.backEnd.getVotesWithCommentsForTechAndEvent(tech._id, votingEvent._id).pipe(map((votes: Vote[]) => ({ votes, flatNode })))
        ),
        map(({ votes, flatNode }) => {
          const commentsEnriched = votes.map((vote) => {
            const cmt: CommentWithVoteIdNode = vote.comment;
            this.setAdditionalInfoInReplies(cmt, vote);
            cmt.voteRing = vote.ring;
            return cmt;
          });
          return { comments: commentsEnriched, flatNode };
        })
      )
      .subscribe(
        ({ comments, flatNode }) => {
          this.comments = comments;
          this.dataSource.data = comments;
          this.expandNodes(flatNode);
        },
        (err) => this.setError(err.message)
      );
  }
  // in order to expand a child node, it is necessary to open all of the nodes parents
  // https://stackoverflow.com/questions/56632492/expand-a-specific-node-of-an-angular-material-tree/56633088#56633088
  // this method finds all the nodes that, starting from flatNode, navigate the tree up to the top father comment
  // and then expand all of them
  expandNodes(flatNode: CommentFlatNode) {
    let nodeIdsToExpand: string[] = [];
    if (flatNode) {
      nodeIdsToExpand = this.idsUpToFather(flatNode.commentId);
    }
    this.nestedNodeMap.forEach((node) => {
      if (nodeIdsToExpand.indexOf(node.commentId) >= 0) {
        this.treeControl.expand(node);
      }
    });
  }
  getNodeIdsToExpand(commentId: string) {
    let nodeToExpand: CommentWithVoteIdNode;
    this.flatNodeMap.forEach((node) => {
      if (node.id === commentId) {
        nodeToExpand = node;
      }
    });
    return nodeToExpand;
  }
  idsUpToFather(commentId: string, ids?: string[]) {
    const idsFound = ids ? ids : [];
    const nodeToExpand = this.getNodeIdsToExpand(commentId);
    const parentId = nodeToExpand.parentCommentId;
    if (parentId) {
      idsFound.push(parentId);
      this.idsUpToFather(parentId, idsFound);
    }
    return idsFound;
  }

  ngOnDestroy() {
    this.commentRetrievalSubscription.unsubscribe();
  }

  setAdditionalInfoInReplies(cmt: CommentWithVoteIdNode, vote: Vote) {
    if (cmt.replies) {
      cmt.replies = cmt.replies.map((rep) => this.setAdditionalInfoInReplies(rep, vote));
    }
    cmt.voteId = vote._id;
    cmt.voteRing = vote.ring;
    return cmt;
  }

  getLevel = (node: CommentFlatNode) => node.level;

  isExpandable = (node: CommentFlatNode) => node.expandable;

  getChildren = (node: CommentWithVoteIdNode): CommentWithVoteIdNode[] => {
    node.replies.forEach((rep: CommentWithVoteIdNode) => (rep.parentCommentId = node.id));
    return node.replies;
  };

  hasChild = (_: number, _nodeData: CommentFlatNode) => {
    return _nodeData.expandable;
  };

  hasNoContent = (_: number, _nodeData: CommentFlatNode) => _nodeData.text === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CommentWithVoteIdNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    let flatNode = existingNode && existingNode.text === node.text ? existingNode : new CommentFlatNode();
    // create a new object if 'refresh' is true to allow a "refreshed" rendering of this element
    flatNode = existingNode && existingNode['refresh'] ? { ...flatNode } : flatNode;
    flatNode.text = node.text;
    flatNode.level = level;
    flatNode.expandable = !!node.replies;
    flatNode.commentId = node.id;
    flatNode.voteId = node.voteId;
    flatNode.voteRing = node.voteRing;
    flatNode.author = node.author;
    flatNode.timestamp = node.timestamp;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Select the comment so we can insert the new reply. */
  addNewItem(node: CommentFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    parentNode.replies ? (node['refresh'] = false) : (node['refresh'] = true);
    parentNode.replies = parentNode.replies ? parentNode.replies : [];
    const newComment: CommentWithVoteIdNode = {
      text: '',
      voteId: parentNode.voteId,
      voteRing: parentNode.voteRing,
      parentCommentId: parentNode.id
    };
    parentNode.replies.unshift(newComment);
    this.dataSource.data = this.comments;
    const thePotentiallyNewFlatNode = this.nestedNodeMap.get(parentNode);
    this.treeControl.expand(thePotentiallyNewFlatNode);
    this._showAddReplyButton = false;
  }

  /** Save the node to database */
  saveComment(node: CommentFlatNode, text: string) {
    this.resetError();
    if (!text || text.trim().length === 0) {
      this.setError('A reply must contain some text');
      return null;
    }
    const nestedNode = this.flatNodeMap.get(node);
    const author = this.authService.user;
    this.backEnd
      .addReplyToVoteComment(node.voteId, { text, author }, nestedNode.parentCommentId)
      .pipe(
        tap(() => this.triggerCommentRetrieval.next(node)),
        tap(() => (this._showAddReplyButton = true))
      )
      .subscribe({ error: (err) => this.setError(err.message) });
  }
  cancelComment(node: CommentFlatNode) {
    this._showAddReplyButton = true;
    this.triggerCommentRetrieval.next(node);
  }

  getTitle(node: CommentFlatNode) {
    let title = node.level > 0 ? `${node.author}   -  ${node.voteRing}` : node.author;
    if (node.level === 0) {
      title = `${node.author}   -  ${node.voteRing}`;
    } else {
      title = node.author;
    }
    return title;
  }
  getTimestamp(node: CommentFlatNode) {
    const ts = new Date(node.timestamp);
    return ts.toLocaleString();
  }

  setError(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
  resetError() {
    this.errorMessage = null;
  }

  showAddReplyButton() {
    return this._showAddReplyButton && this.allowAddComment;
  }
}
