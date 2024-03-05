import { TestBed } from '@angular/core/testing';

import { AddWallPostService } from './add-wall-post.service';

describe('AddWallPostService', () => {
  let service: AddWallPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddWallPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
