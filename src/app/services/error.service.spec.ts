import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { HttpClientModule } from '@angular/common/http';

describe('ErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: ErrorService = TestBed.get(ErrorService);
    expect(service).toBeTruthy();
  });
});
