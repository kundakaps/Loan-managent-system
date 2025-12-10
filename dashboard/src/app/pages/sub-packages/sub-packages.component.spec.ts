import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPackagesComponent } from './sub-packages.component';

describe('SubPackagesComponent', () => {
  let component: SubPackagesComponent;
  let fixture: ComponentFixture<SubPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
