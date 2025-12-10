import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRepaymentsComponent } from './user-repayments.component';

describe('UserRepaymentsComponent', () => {
  let component: UserRepaymentsComponent;
  let fixture: ComponentFixture<UserRepaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRepaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
