import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMessagingComponent } from './form-messaging.component';

describe('FormMessagingComponent', () => {
  let component: FormMessagingComponent;
  let fixture: ComponentFixture<FormMessagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMessagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
