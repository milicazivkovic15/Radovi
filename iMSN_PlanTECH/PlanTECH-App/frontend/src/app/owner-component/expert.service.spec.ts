/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExpertService } from './expert.service';

describe('ExpertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpertService]
    });
  });

  it('should ...', inject([ExpertService], (service: ExpertService) => {
    expect(service).toBeTruthy();
  }));
});
