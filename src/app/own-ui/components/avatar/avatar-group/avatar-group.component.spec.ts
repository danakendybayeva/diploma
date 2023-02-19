import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCAvatarGroupComponent } from './avatar-group.component';

describe('TCAvatarGroupComponent', () => {
  let component: TCAvatarGroupComponent;
  let fixture: ComponentFixture<TCAvatarGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCAvatarGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCAvatarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
