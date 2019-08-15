import { TestBed, inject } from '@angular/core/testing';

import { EditRulesService } from './edit-rules.service';

describe('EditRulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditRulesService]
    });
  });

  it('should ...', inject([EditRulesService], (service: EditRulesService) => {
    expect(service).toBeTruthy();
  }));
});
