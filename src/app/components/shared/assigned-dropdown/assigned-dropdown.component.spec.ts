import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDropdownComponent } from './assigned-dropdown.component';

describe('AssignedDropdownComponent', () => {
  let component: AssignedDropdownComponent;
  let fixture: ComponentFixture<AssignedDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
