import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAttachmentsComponent } from './file-attachments.component';
import {ToastrModule, ToastrService} from "ngx-toastr";
import {PatientService} from "src/app/common/services/http/patient.service";
import {AdvocacyService} from "src/app/common/services/http/advocacy.service";
import {CustomerWorkitemService} from "src/app/common/services/http/customer-workitem.service";
import {WorkitemService} from "src/app/common/services/http/workitem.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FileAttachmentData} from "./file-attachment-data";
import {of} from "rxjs";

describe('FileAttachmentsComponent', () => {
  let component: FileAttachmentsComponent;
  let fixture: ComponentFixture<FileAttachmentsComponent>;

  let mockToastrService: ToastrService;
  let mockPatientService: PatientService;
  let mockAdvocacyService: AdvocacyService;
  let mockCustomerWorkitemService: CustomerWorkitemService;
  let mockWorkitemService: WorkitemService;

  let mockWindow;
  let spyToasterInfo;
  let spyToasterError;
  let onFileAttachmentsChanged: boolean;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileAttachmentsComponent ],
      imports: [ ToastrModule.forRoot(), HttpClientTestingModule ],
      providers: [
        ToastrService,
        PatientService,
        AdvocacyService,
        CustomerWorkitemService,
        WorkitemService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockWindow = jasmine.createSpyObj('Window', ['open']);
    mockWindow['URL'] = {
      createObjectURL: () => {
        return 'fakeUrl';
      }
    };

    mockToastrService = TestBed.inject(ToastrService);
    spyToasterInfo = spyOn(mockToastrService, 'info');
    spyToasterError = spyOn(mockToastrService, 'error');

    mockPatientService = TestBed.inject(PatientService);
    mockAdvocacyService = TestBed.inject(AdvocacyService);
    mockCustomerWorkitemService = TestBed.inject(CustomerWorkitemService);
    mockWorkitemService = TestBed.inject(WorkitemService);

    fixture = TestBed.createComponent(FileAttachmentsComponent);
    component = fixture.componentInstance;

    component.fileAttachmentData = new FileAttachmentData();
    onFileAttachmentsChanged = false;
    component.fileAttachmentsChanged.subscribe(() => {
      onFileAttachmentsChanged = true;
    });

    component.attachmentTransmissionInterfaceName = 'PatientService';
    component.localizedWindow = mockWindow;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can add an attachment', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'application/pdf', name: 'test-file.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).not.toHaveBeenCalled();
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(1);
    expect(component.fileAttachmentData.filesList.length).toEqual(1);
  });

  it('cannot attach more than max attachments', () => {

    const fakeEvent = {
      target: {
        files: [
          {type: 'application/pdf', name: 'test-file1.pdf', size: 1},
          {type: 'application/pdf', name: 'test-file2.pdf', size: 1},
          {type: 'application/pdf', name: 'test-file3.pdf', size: 1},
          {type: 'application/pdf', name: 'test-file4.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).toHaveBeenCalledTimes(1);
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(3);
    expect(component.fileAttachmentData.filesList.length).toEqual(3);

    expect(spyToasterError).not.toHaveBeenCalled();
  });

  it('can attach file types of pdf, jpg, png', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'application/pdf', name: 'test-file1.pdf', size: 1},
          {type: 'image/jpeg', name: 'test-file2.pdf', size: 1},
          {type: 'image/png', name: 'test-file3.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).not.toHaveBeenCalled();
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(3);
    expect(component.fileAttachmentData.filesList.length).toEqual(3);
  });

  it('can attach word documents (doc, docx)', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', name: 'test-file1.pdf', size: 1},
          {type: 'application/msword', name: 'test-file2.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).not.toHaveBeenCalled();
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(2);
    expect(component.fileAttachmentData.filesList.length).toEqual(2);
  });

  it('cannot attached invalid file types', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'text/plain', name: 'test-file1.pdf', size: 1},
          {type: 'image/bmp', name: 'test-file2.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).toHaveBeenCalledTimes(2);
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(0);
    expect(component.fileAttachmentData.filesList.length).toEqual(0);
  });

  it('cannot add a duplicate attachment', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'application/pdf', name: 'test-file.pdf', size: 1},
          {type: 'application/pdf', name: 'test-file.pdf', size: 1}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).toHaveBeenCalled();
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(1);
    expect(component.fileAttachmentData.filesList.length).toEqual(1);
  });


  it('cannot add large files', () => {
    const fakeEvent = {
      target: {
        files: [
          {type: 'application/pdf', name: 'test-file.pdf', size: 1010241025}
        ]
      }
    };

    component.addAttachment(fakeEvent, 'id');

    expect(spyToasterInfo).toHaveBeenCalled();
    expect(spyToasterError).not.toHaveBeenCalled();
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(0);
    expect(component.fileAttachmentData.filesList.length).toEqual(0);
  });

  it('can delete a file which is stored in the datasource', () => {
    component.fileAttachmentData.filesList = [
      {name: 'test-file.pdf', id: 1},
      {name: 'test-file2.pdf', id: 2},
      {name: 'test-file3.pdf', id: null},
      {name: 'test-file4.pdf', id: null}
    ];
    component.fileAttachmentData.selectedFiles = [
      {type: 'id', file: {type: 'application/pdf', name: 'test-file3.pdf', size: 1}},
      {type: 'id', file: {type: 'application/pdf', name: 'test-file4.pdf', size: 1}}
    ];

    component.deleteSelectedFile(1, 2);

    expect(component.fileAttachmentData.filesList.length).toEqual(3);
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(2);
    expect(component.fileAttachmentData.deletedFilesList.length).toEqual(1);
    expect(onFileAttachmentsChanged).toBeTrue();
  });

  it('can delete a file which is not stored in the datasource', () => {
    component.fileAttachmentData.filesList = [
      {name: 'test-file.pdf', id: 1},
      {name: 'test-file2.pdf', id: 2},
      {name: 'test-file3.pdf', id: null},
      {name: 'test-file4.pdf', id: null}
    ];
    component.fileAttachmentData.selectedFiles = [
      {type: 'id', file: {type: 'application/pdf', name: 'test-file3.pdf', size: 1}},
      {type: 'id', file: {type: 'application/pdf', name: 'test-file4.pdf', size: 1}}
    ];

    component.deleteSelectedFile(2, null);

    expect(component.fileAttachmentData.filesList.length).toEqual(3);
    expect(component.fileAttachmentData.selectedFiles.length).toEqual(1);
    expect(component.fileAttachmentData.deletedFilesList.length).toEqual(0);
    expect(onFileAttachmentsChanged).toBeTrue();
  });

  it('can open a file that is not saved to the API', () => {
    component.fileAttachmentData.selectedFiles = [
      {type: 'id', file: {type: 'application/pdf', name: 'test-file.pdf', size: 1}}
    ];

    component.openFile(null, 'test-file.pdf');

    expect(mockWindow.open).toHaveBeenCalledWith('fakeUrl');
  });

  it('can open a file that is saved to the API', () => {
    const fakeFileResponse = {
      type: 'application/pdf',
      size: 1
    };
    spyOn(mockPatientService, 'getAttachmentById').and.returnValue(of(fakeFileResponse));

    component.openFile(1, 'test-file.pdf');

    expect(mockWindow.open).toHaveBeenCalledWith('fakeUrl');
  });

  it('it initializes with the right attachement service', () => {
    component.attachmentTransmissionInterfaceName = 'PatientService';
    component.setupAttachmentHttpTransmissionInterface();
    expect(component.attachmentTransmissionInterface).toBe(mockPatientService);

    component.attachmentTransmissionInterfaceName = 'AdvocacyService';
    component.setupAttachmentHttpTransmissionInterface();
    expect(component.attachmentTransmissionInterface).toBe(mockAdvocacyService);

    component.attachmentTransmissionInterfaceName = 'CustomerWorkitemService';
    component.setupAttachmentHttpTransmissionInterface();
    expect(component.attachmentTransmissionInterface).toBe(mockCustomerWorkitemService);

    component.attachmentTransmissionInterfaceName = 'WorkitemService';
    component.setupAttachmentHttpTransmissionInterface();
    expect(component.attachmentTransmissionInterface).toBe(mockWorkitemService);
  });
});
