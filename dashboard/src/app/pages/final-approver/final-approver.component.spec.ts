import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalApproverComponent } from './final-approver.component';

describe('FinalApproverComponent', () => {
  let component: FinalApproverComponent;
  let fixture: ComponentFixture<FinalApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
