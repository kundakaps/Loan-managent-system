import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSidebarComponent } from './credit-sidebar.component';

describe('CreditSidebarComponent', () => {
  let component: CreditSidebarComponent;
  let fixture: ComponentFixture<CreditSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
