import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, getTestBed, TestBed } from '@angular/core/testing';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ConfirmLeaveModalComponent } from './confirm-leave-modal.component';

describe('ConfirmLeaveComponent ', () => {
  let component: ConfirmLeaveModalComponent;
  let fixture: ComponentFixture<ConfirmLeaveModalComponent>;
  let bsModalService: BsModalRef;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmLeaveModalComponent],
      imports: [HttpClientTestingModule,ModalModule.forRoot()],
      providers: [BsModalRef]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLeaveModalComponent);
    bsModalService = getTestBed().get(BsModalRef);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not return form when no values set',async(()=>{
    component.subject= new Subject;
    component.action(true)
    expect(component.subject).toBeTruthy();
  }));

});
