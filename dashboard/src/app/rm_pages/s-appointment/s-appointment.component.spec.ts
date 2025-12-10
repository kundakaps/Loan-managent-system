import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAppointmentComponent } from './s-appointment.component';

describe('SAppointmentComponent', () => {
  let component: SAppointmentComponent;
  let fixture: ComponentFixture<SAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SAppointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
