import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpPaymentsComponent } from './erp-payments.component';

describe('ErpPaymentsComponent', () => {
  let component: ErpPaymentsComponent;
  let fixture: ComponentFixture<ErpPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErpPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErpPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
