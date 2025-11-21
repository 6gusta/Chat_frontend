import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoCanal } from './plano-canal';

describe('PlanoCanal', () => {
  let component: PlanoCanal;
  let fixture: ComponentFixture<PlanoCanal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanoCanal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanoCanal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
