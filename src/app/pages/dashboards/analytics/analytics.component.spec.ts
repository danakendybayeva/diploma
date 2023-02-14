import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAnalyticsComponent } from './analytics.component';

describe('PageAnalyticsComponent', () => {
  let component: PageAnalyticsComponent;
  let fixture: ComponentFixture<PageAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
