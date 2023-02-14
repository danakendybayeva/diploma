import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConnectionsComponent } from './connections.component';

describe('PageConnectionsComponent', () => {
  let component: PageConnectionsComponent;
  let fixture: ComponentFixture<PageConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
