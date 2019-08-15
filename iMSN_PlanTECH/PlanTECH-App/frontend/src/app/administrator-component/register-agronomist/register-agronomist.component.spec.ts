import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAgronomistComponent } from './register-agronomist.component';

describe('RegisterAgronomistComponent', () => {
  let component: RegisterAgronomistComponent;
  let fixture: ComponentFixture<RegisterAgronomistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterAgronomistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAgronomistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
