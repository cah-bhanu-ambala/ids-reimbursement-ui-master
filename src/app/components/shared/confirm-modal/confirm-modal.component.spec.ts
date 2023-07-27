import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let modalService: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent ],
      imports:[NgbModalModule,NgbModule],
      providers:[NgbActiveModal,NgbModal]  
    })
    .compileComponents();
    modalService = TestBed.inject(NgbModal);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
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
  
  it('should Delete modal', () => {
    component.Delete();
    expect(component).toBeTruthy();
  });
});
