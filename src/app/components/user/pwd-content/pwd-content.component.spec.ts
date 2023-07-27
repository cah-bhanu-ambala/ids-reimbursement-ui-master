import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwdContentComponent } from './pwd-content.component';

describe('PwdContentComponent', () => {
  let component: PwdContentComponent;
  let fixture: ComponentFixture<PwdContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwdContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
