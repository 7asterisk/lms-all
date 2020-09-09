import { TestBed } from '@angular/core/testing';

import { TrGuardGuard } from './tr-guard.guard';

describe('TrGuardGuard', () => {
  let guard: TrGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TrGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
