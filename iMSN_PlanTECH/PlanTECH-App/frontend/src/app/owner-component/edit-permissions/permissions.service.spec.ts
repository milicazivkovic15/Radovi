import { TestBed, inject } from '@angular/core/testing';

import { PermissionsService } from './permissions-service.service';

describe('PermissionsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionsServiceService]
    });
  });

  it('should ...', inject([PermissionsServiceService], (service: PermissionsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
