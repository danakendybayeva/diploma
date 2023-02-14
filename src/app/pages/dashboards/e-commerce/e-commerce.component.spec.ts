import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageECommerceComponent } from './e-commerce.component';

describe('PageECommerceComponent', () => {
  let component: PageECommerceComponent;
  let fixture: ComponentFixture<PageECommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageECommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageECommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
