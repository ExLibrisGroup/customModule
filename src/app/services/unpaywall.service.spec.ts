import { TestBed } from '@angular/core/testing';

import { UnpaywallService } from './unpaywall.service';

describe('UnpaywallService', () => {
  let service: UnpaywallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnpaywallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
