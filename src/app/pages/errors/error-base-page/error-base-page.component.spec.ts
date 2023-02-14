import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBasePageComponent } from './error-base-page.component';

describe('ErrorBasePageComponent', () => {
  let component: ErrorBasePageComponent;
  let fixture: ComponentFixture<ErrorBasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorBasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
