import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Page505Component } from './page-505.component';

describe('Page505Component', () => {
  let component: Page505Component;
  let fixture: ComponentFixture<Page505Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Page505Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Page505Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
