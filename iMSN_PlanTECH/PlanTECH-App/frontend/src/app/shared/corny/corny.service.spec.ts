import { TestBed, inject } from '@angular/core/testing';

import { CornyService } from './corny.service';

describe('CornyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CornyService]
    });
  });

  it('should ...', inject([CornyService], (service: CornyService) => {
    expect(service).toBeTruthy();
  }));
});
