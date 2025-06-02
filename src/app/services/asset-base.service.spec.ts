import { TestBed } from '@angular/core/testing';

import { AssetBaseService } from './asset-base.service';

describe('AssetBaseService', () => {
  let service: AssetBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
