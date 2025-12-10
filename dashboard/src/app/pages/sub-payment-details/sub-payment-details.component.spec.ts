import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPaymentDetailsComponent } from './sub-payment-details.component';

describe('SubPaymentDetailsComponent', () => {
  let component: SubPaymentDetailsComponent;
  let fixture: ComponentFixture<SubPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
