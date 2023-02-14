import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageResetPasswordConfirmComponent } from './reset-password-confirm.component';

describe('PageResetPasswordConfirmComponent', () => {
  let component: PageResetPasswordConfirmComponent;
  let fixture: ComponentFixture<PageResetPasswordConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageResetPasswordConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageResetPasswordConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
