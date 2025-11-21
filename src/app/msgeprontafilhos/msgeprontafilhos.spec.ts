import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Msgeprontafilhos } from './msgeprontafilhos';

describe('Msgeprontafilhos', () => {
  let component: Msgeprontafilhos;
  let fixture: ComponentFixture<Msgeprontafilhos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Msgeprontafilhos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Msgeprontafilhos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
