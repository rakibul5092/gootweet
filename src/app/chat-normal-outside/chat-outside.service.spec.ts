import { TestBed } from '@angular/core/testing';

import { ChatOutsideService } from './chat-outside.service';

describe('ChatOutsideService', () => {
  let service: ChatOutsideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOutsideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
