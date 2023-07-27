import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/common/services/spinner/spinner.service';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  const showSub = new Subject<boolean>();
  const spinnerService = jasmine.createSpyObj('SpinnerService', [
    'setSpinner'
  ], {
    show$: showSub.asObservable()
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      providers: [
        { provide: SpinnerService, useValue: spinnerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set show', <any>fakeAsync(() => {
    showSub.next(true);
    tick();
    expect(component).toBeTruthy();
  }));
});
