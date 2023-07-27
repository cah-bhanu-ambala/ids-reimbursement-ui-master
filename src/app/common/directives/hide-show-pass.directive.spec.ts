import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HideShowPassDirective } from './hide-show-pass.directive';

@Component({
  template: `<input appHideShowPass />`
})
class TestComponent { }

describe('HideShowPassDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, HideShowPassDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).createComponent(TestComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    // const directive = new HideShowPassDirective();
    expect(fixture).toBeTruthy();
  });
});
