import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CornyComponent } from './corny.component';

describe('CornyComponent', () => {
  let component: CornyComponent;
  let fixture: ComponentFixture<CornyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CornyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CornyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
