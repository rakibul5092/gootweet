import { TestBed } from '@angular/core/testing';

import { LiveVideoStreamService } from './live-video-stream.service';

describe('LiveVideoStreamService', () => {
  let service: LiveVideoStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveVideoStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
