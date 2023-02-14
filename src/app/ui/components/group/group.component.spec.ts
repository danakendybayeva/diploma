import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCGroupComponent } from './group.component';

describe('GroupComponent', () => {
  let component: TCGroupComponent;
  let fixture: ComponentFixture<TCGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TCGroupComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
