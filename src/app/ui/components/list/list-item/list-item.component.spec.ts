import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCListItemComponent } from './list-item.component';

describe('TCListItemComponent', () => {
  let component: TCListItemComponent;
  let fixture: ComponentFixture<TCListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TCListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
