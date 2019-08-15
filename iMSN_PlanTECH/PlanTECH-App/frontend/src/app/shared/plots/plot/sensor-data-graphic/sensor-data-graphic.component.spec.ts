import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataGraphicComponent } from './sensor-data-graphic.component';

describe('SensorDataGraphicComponent', () => {
  let component: SensorDataGraphicComponent;
  let fixture: ComponentFixture<SensorDataGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorDataGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorDataGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
