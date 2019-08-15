/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EditCulturesService } from './edit-cultures.service';

describe('EditCulturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditCulturesService]
    });
  });

  it('should ...', inject([EditCulturesService], (service: EditCulturesService) => {
    expect(service).toBeTruthy();
  }));
});
