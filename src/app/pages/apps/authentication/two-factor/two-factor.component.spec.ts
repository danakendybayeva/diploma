import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVerifyAccountComponent } from './verify-account.component';

describe('PageVerifyAccountComponent', () => {
  let component: PageVerifyAccountComponent;
  let fixture: ComponentFixture<PageVerifyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageVerifyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVerifyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
