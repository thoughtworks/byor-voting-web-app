import { TestBed } from '@angular/core/testing';

import {VoteModule} from '../vote.module';
import { VoteService } from './vote.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, VoteModule ],
  }));

  it('should be created', () => {
    const service: VoteService = TestBed.get(VoteService);
    expect(service).toBeTruthy();
  });
});
