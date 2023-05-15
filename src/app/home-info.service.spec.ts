import { TestBed } from '@angular/core/testing';

import { HomeInfoService } from './home-info.service';

describe('HomeInfoService', () => {
  let service: HomeInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
