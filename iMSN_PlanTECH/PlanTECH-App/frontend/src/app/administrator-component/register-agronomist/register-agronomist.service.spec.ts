import { TestBed, inject } from '@angular/core/testing';

import { RegisterAgronomistService } from './register-agronomist.service';

describe('RegisterAgronomistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterAgronomistService]
    });
  });

  it('should ...', inject([RegisterAgronomistService], (service: RegisterAgronomistService) => {
    expect(service).toBeTruthy();
  }));
});
