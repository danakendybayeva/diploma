import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TCAutocompleteMdsComponent } from './autocomplete-mds.component';

describe('TCAutocompleteComponent', () => {
  let component: TCAutocompleteMdsComponent;
  let fixture: ComponentFixture<TCAutocompleteMdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCAutocompleteMdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCAutocompleteMdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
