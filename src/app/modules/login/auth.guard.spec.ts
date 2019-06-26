import { TestBed, async, inject } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [AuthGuard]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
