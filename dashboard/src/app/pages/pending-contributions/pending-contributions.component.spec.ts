import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingContributionsComponent } from './pending-contributions.component';

describe('PendingContributionsComponent', () => {
  let component: PendingContributionsComponent;
  let fixture: ComponentFixture<PendingContributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingContributionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
