/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AgronomistComponent } from './agronomist-component.component';

describe('AgronomistComponentComponent', () => {
  let component: AgronomistComponent;
  let fixture: ComponentFixture<AgronomistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgronomistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgronomistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
