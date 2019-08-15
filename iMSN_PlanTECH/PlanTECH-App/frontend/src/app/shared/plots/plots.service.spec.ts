import { TestBed, inject } from '@angular/core/testing';

import { PlotsService } from './plots.service';

describe('PlotsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlotsService]
    });
  });

  it('should ...', inject([PlotsService], (service: PlotsService) => {
    expect(service).toBeTruthy();
  }));
});
