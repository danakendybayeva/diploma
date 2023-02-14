import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCProgressComponent } from './progress.component';

describe('ProgressComponent', () => {
  let component: TCProgressComponent;
  let fixture: ComponentFixture<TCProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
