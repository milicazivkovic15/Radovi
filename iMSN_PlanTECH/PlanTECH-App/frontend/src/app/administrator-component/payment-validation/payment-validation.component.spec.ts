import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentValidationComponent } from './payment-validation.component';

describe('PaymentValidationComponent', () => {
  let component: PaymentValidationComponent;
  let fixture: ComponentFixture<PaymentValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
