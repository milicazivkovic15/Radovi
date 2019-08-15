/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddRuleAgrComponent } from './add-rule-agr.component';

describe('AddRuleAgrComponent', () => {
  let component: AddRuleAgrComponent;
  let fixture: ComponentFixture<AddRuleAgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRuleAgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRuleAgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
