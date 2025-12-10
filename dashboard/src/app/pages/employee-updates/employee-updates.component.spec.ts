import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdatesComponent } from './employee-updates.component';

describe('EmployeeUpdatesComponent', () => {
  let component: EmployeeUpdatesComponent;
  let fixture: ComponentFixture<EmployeeUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeUpdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
