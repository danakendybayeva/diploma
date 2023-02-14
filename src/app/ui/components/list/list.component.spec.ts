import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCListComponent } from './list.component';

describe('PageListsComponent', () => {
  let component: TCListComponent;
  let fixture: ComponentFixture<TCListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TCListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
