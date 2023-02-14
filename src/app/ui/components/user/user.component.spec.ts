import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCUserComponent } from './user.component';

describe('TCUserComponent', () => {
  let component: TCUserComponent;
  let fixture: ComponentFixture<TCUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
