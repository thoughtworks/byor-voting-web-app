import { Component, OnDestroy, OnInit } from '@angular/core';
import * as D3 from 'd3';
import d3Cloud from 'd3-cloud';

import { TwRings } from '../../../models/ring';
import { ReplaySubject, Subscription } from 'rxjs';
import { VoteCloudService, VotesCount } from './vote-cloud.service';
import { Router } from '@angular/router';

declare let d3: any;

const colors = {
  Tools: '#86b782',
  Techniques: '#1ebccd',
  Platforms: '#f38a3e',
  'Languages & Frameworks': '#b32059'
};

@Component({
  selector: 'byor-vote-cloud',
  templateUrl: './vote-cloud.component.html',
  styleUrls: ['./vote-cloud.component.scss']
})
export class VoteCloudComponent implements OnInit, OnDestroy {
  data = [];
  eventName$ = new ReplaySubject<string>();

  private svg;
  private margin: number;
  private width: number;
  private height: number;

  rings = TwRings.names;
  selectedRing: string;
  selectedRing$ = new ReplaySubject<string>();
  private subscription: Subscription;

  ringSelected(ring: string) {
    if (this.isRingSelected(ring)) {
      this.selectedRing = 'none';
    } else {
      this.selectedRing = ring;
    }
    this.selectedRing$.next(this.selectedRing);
  }

  isRingSelected(ring: string) {
    return this.selectedRing === ring;
  }

  constructor(private router: Router, private voteCloudService: VoteCloudService) {}

  ngOnInit() {
    this.subscription = this.voteCloudService.vote(this.selectedRing$).subscribe((votes) => this.createVoteCloud(votes));
    this.selectedRing$.next('none');

    const eventName = (this.voteCloudService.getVotingEvent() && this.voteCloudService.getVotingEvent().name) || 'All Events';
    this.eventName$.next(eventName);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createVoteCloud(votes: VotesCount[]) {
    const maxVotes = votes.reduce((max, val) => Math.max(max, val.votes), 0);
    this.data = votes.map(function(d) {
      return { text: d.name, size: (d.votes / maxVotes) * 60, color: colors[d.quadrant] };
    });
    this.clearSVG();
    this.setup();
    this.buildSVG();
    this.populate();
  }

  private setup() {
    this.margin = 100;
    this.width = window.innerWidth - 2 * this.margin;
    this.height = this.width * 0.75 - 2 * this.margin;
  }

  private clearSVG() {
    if (this.svg) {
      D3.select('svg').remove();
    }
  }

  private buildSVG() {
    this.svg = D3.select('div.word-cloud')
      .append('svg')
      .attr('width', this.width + 2 * this.margin)
      .attr('height', this.height + 2 * this.margin)
      .append('g')
      // tslint:disable:no-bitwise
      .attr('transform', 'translate(' + (~~(this.width / 2) + 100) + ',' + (~~(this.height / 2) - 100) + ')');
    // tslint:enable:no-bitwise
  }

  private populate() {
    const fontFace = 'Open Sans';
    const spiralType = 'archimedean';

    d3Cloud()
      .size([this.width, this.height])
      .words(this.data)
      .padding(5)
      // tslint:disable:no-bitwise
      .rotate(() => ~~(Math.random() * 2) * 90)
      // tslint:enable:no-bitwise
      .font(fontFace)
      .fontSize((d) => d.size)
      .spiral(spiralType)
      .on('end', () => {
        this.drawWordCloud(this.data);
      })
      .start();
  }

  private drawWordCloud(words) {
    this.svg
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', (d) => d.size + 'px')
      .style('fill', (d) => d.color)
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
      .attr('class', 'word-cloud')
      .text((d) => d.text);
  }

  goBack() {
    const route = 'vote/start';
    this.router.navigate([route]);
  }
}
