import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolPaymentsComponent } from './school-payments.component';

describe('SchoolPaymentsComponent', () => {
  let component: SchoolPaymentsComponent;
  let fixture: ComponentFixture<SchoolPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
