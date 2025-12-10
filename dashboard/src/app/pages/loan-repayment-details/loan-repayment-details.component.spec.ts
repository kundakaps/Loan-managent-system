import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRepaymentDetailsComponent } from './loan-repayment-details.component';

describe('LoanRepaymentDetailsComponent', () => {
  let component: LoanRepaymentDetailsComponent;
  let fixture: ComponentFixture<LoanRepaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRepaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRepaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
