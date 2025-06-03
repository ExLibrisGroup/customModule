import { TestBed } from '@angular/core/testing';

import { SearchEntityService } from './search-entity.service';

describe('SearchEntityService', () => {
  let service: SearchEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
