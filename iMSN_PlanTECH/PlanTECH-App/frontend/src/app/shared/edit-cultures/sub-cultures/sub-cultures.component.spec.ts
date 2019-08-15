/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubCulturesComponent } from './sub-cultures.component';

describe('SubCulturesComponent', () => {
  let component: SubCulturesComponent;
  let fixture: ComponentFixture<SubCulturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCulturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCulturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
