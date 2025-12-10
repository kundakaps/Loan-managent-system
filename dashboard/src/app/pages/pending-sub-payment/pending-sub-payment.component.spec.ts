import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSubPaymentComponent } from './pending-sub-payment.component';

describe('PendingSubPaymentComponent', () => {
  let component: PendingSubPaymentComponent;
  let fixture: ComponentFixture<PendingSubPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSubPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingSubPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
