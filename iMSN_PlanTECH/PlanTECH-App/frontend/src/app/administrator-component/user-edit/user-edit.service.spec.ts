import { TestBed, inject } from '@angular/core/testing';

import { UserEditService } from './user-edit.service';

describe('UserEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserEditService]
    });
  });

  it('should ...', inject([UserEditService], (service: UserEditService) => {
    expect(service).toBeTruthy();
  }));
});
