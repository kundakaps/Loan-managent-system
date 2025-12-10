import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSidebarComponent } from './ip-sidebar.component';

describe('IpSidebarComponent', () => {
  let component: IpSidebarComponent;
  let fixture: ComponentFixture<IpSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
