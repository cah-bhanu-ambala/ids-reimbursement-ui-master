import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InputModalComponent } from './input-modal.component';

describe('InputModalComponent', () => {
  let component: InputModalComponent;
  let fixture: ComponentFixture<InputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputModalComponent ],
      providers:[NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputModalComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On Change returns notes true', () => {
    let notes = '';
    component.notes = '';
    component.onChange(notes);
    expect(component.notes).toEqual('');
    expect(component.error).toBeTrue();
  });

  it('On Change returns notes false', () => {
    let notes = 'test';
    component.notes = 'test';
    component.onChange(notes);
    expect(component.notes).toEqual('test');
    expect(component.error).toBeFalse();
  });

  
  it('On proceed returns notes true', () => {
    let notes = '';
    component.notes = '';
    component.proceed();
    expect(component.notes).toEqual('');
    expect(component.error).toBeTrue();
  });

  it('On proceed returns notes false', () => {
    let notes = 'test';
    component.notes = 'test';
    component.proceed();
    expect(component.notes).toEqual('test');
    expect(component.error).toBeFalse();
  });

  it('On close returns notes true', () => {    
    component.notes = '';
    component.close();   
    expect(component.error).toBeFalse();
  });
});
