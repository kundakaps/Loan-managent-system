import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLinkComponent } from './password-link.component';

describe('PasswordLinkComponent', () => {
  let component: PasswordLinkComponent;
  let fixture: ComponentFixture<PasswordLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
