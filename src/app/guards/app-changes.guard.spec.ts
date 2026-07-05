import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { appChangesGuard } from './app-changes.guard';

describe('appGguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => appChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
