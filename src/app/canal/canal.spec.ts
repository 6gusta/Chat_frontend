import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canal } from './canal';

describe('Canal', () => {
  let component: Canal;
  let fixture: ComponentFixture<Canal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Canal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
