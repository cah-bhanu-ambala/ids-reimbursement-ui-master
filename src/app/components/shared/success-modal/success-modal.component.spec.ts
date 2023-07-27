import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';

import { SuccessModalComponent } from './success-modal.component';

describe('SuccessModalComponent', () => {
  let component: SuccessModalComponent;
  let fixture: ComponentFixture<SuccessModalComponent>;
  let modalService: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessModalComponent ],
      imports:[NgbModalModule,NgbModule],
      providers:[NgbActiveModal,NgbModal]  
    })
    .compileComponents();
    modalService = TestBed.inject(NgbModal);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(async(() => {
    let spyOpen = spyOn(modalService, "open").and.returnValue(modalRef);  
    })); 

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.Close();
    expect(component).toBeTruthy();
  });
});
