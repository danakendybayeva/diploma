import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCCircleProgressComponent } from './circle-progress.component';

describe('TCCircleProgressComponent', () => {
  let component: TCCircleProgressComponent;
  let fixture: ComponentFixture<TCCircleProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCCircleProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCCircleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
