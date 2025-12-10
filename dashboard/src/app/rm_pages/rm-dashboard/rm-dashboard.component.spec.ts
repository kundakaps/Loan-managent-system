import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmDashboardComponent } from './rm-dashboard.component';

describe('RmDashboardComponent', () => {
  let component: RmDashboardComponent;
  let fixture: ComponentFixture<RmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
