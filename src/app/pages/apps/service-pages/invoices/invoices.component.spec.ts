import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInvoicesComponent } from './invoices.component';

describe('PageInvoiceComponent', () => {
  let component: PageInvoicesComponent;
  let fixture: ComponentFixture<PageInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
