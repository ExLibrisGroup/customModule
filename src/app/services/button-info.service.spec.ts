import { TestBed } from '@angular/core/testing';

import { ButtonInfoService } from './button-info.service';

describe('ButtonInfoService', () => {
  let service: ButtonInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
