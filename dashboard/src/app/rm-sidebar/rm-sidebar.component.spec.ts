import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmSidebarComponent } from './rm-sidebar.component';

describe('RmSidebarComponent', () => {
  let component: RmSidebarComponent;
  let fixture: ComponentFixture<RmSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
