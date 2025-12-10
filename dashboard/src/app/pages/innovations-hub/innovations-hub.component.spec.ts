import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationsHubComponent } from './innovations-hub.component';

describe('InnovationsHubComponent', () => {
  let component: InnovationsHubComponent;
  let fixture: ComponentFixture<InnovationsHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnovationsHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnovationsHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
