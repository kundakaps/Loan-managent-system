import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionDetailsComponent } from './contribution-details.component';

describe('ContributionDetailsComponent', () => {
  let component: ContributionDetailsComponent;
  let fixture: ComponentFixture<ContributionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
