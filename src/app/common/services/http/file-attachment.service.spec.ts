import { TestBed } from '@angular/core/testing';

import { FileAttachmentService } from './file-attachment.service';
import {PatientService} from "./patient.service";
import {AdvocacyService} from "./advocacy.service";
import {CustomerWorkitemService} from "./customer-workitem.service";
import {WorkitemService} from "./workitem.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FileAttachmentData} from "../../../components/shared/file-attachments/file-attachment-data";

describe('FileAttachmentService', () => {
  let service: FileAttachmentService;

  let mockPatientService, mockAdvocacyService, mockCustomerWorkitemService, mockWorkitemService;

  beforeEach(() => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['postAttachment', 'deleteAttachment']);
    mockAdvocacyService = jasmine.createSpyObj('AdvocacyService', ['postAttachment', 'deleteAttachment']);
    mockCustomerWorkitemService = jasmine.createSpyObj('CustomerWorkitemService', ['postAttachment', 'deleteAttachment']);
    mockWorkitemService = jasmine.createSpyObj('WorkitemService', ['postAttachment', 'deleteAttachment']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {provide: PatientService, useValue: mockPatientService},
        {provide: AdvocacyService, useValue: mockAdvocacyService},
        {provide: CustomerWorkitemService, useValue: mockCustomerWorkitemService},
        {provide: WorkitemService, useValue: mockWorkitemService}
      ]
    });
    service = TestBed.inject(FileAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can post attachments using the PatientService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    const blob = new Blob([""], {type : 'application/pdf'});
    fakeFileAttachmentData.selectedFiles = [
      {type: 'id', file: blob}
    ];

    service.postAttachments('advocacyId', 'fakeReferenceFieldValue', fakeFileAttachmentData);

    expect(mockPatientService.postAttachment.calls.count()).toEqual(1);
    let formDataSent = mockPatientService.postAttachment.calls.first().args[0];
    expect(formDataSent.get('advocacyId')).toEqual('fakeReferenceFieldValue');

    expect(mockAdvocacyService.postAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.postAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.postAttachment).not.toHaveBeenCalled();
  });

  it('can post attachments using the AdvocacyService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    const blob = new Blob([""], {type : 'application/pdf'});
    fakeFileAttachmentData.selectedFiles = [
      {type: 'id', file: blob}
    ];

    service.postAttachments('appointmentId', 'fakeReferenceFieldValue', fakeFileAttachmentData);

    expect(mockPatientService.postAttachment).not.toHaveBeenCalled();

    expect(mockAdvocacyService.postAttachment.calls.count()).toEqual(1);
    let formDataSent = mockAdvocacyService.postAttachment.calls.first().args[0];
    expect(formDataSent.get('appointmentId')).toEqual('fakeReferenceFieldValue');

    expect(mockCustomerWorkitemService.postAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.postAttachment).not.toHaveBeenCalled();
  });

  it('can post attachments using the CustomerWorkitemService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    const blob = new Blob([""], {type : 'application/pdf'});
    fakeFileAttachmentData.selectedFiles = [
      {type: 'id', file: blob}
    ];

    service.postAttachments('customerWorkItemId', 'fakeReferenceFieldValue', fakeFileAttachmentData);

    expect(mockPatientService.postAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.postAttachment).not.toHaveBeenCalled();

    expect(mockCustomerWorkitemService.postAttachment.calls.count()).toEqual(1);
    let formDataSent = mockCustomerWorkitemService.postAttachment.calls.first().args[0];
    expect(formDataSent.get('customerWorkItemId')).toEqual('fakeReferenceFieldValue');

    expect(mockWorkitemService.postAttachment).not.toHaveBeenCalled();
  });

  it('can post attachments using the WorkitemService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    const blob = new Blob([""], {type : 'application/pdf'});
    fakeFileAttachmentData.selectedFiles = [
      {type: 'id', file: blob}
    ];

    service.postAttachments('workItemId', 'fakeReferenceFieldValue', fakeFileAttachmentData);

    expect(mockPatientService.postAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.postAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.postAttachment).not.toHaveBeenCalled();

    expect(mockWorkitemService.postAttachment.calls.count()).toEqual(1);
    let formDataSent = mockWorkitemService.postAttachment.calls.first().args[0];
    expect(formDataSent.get('workItemId')).toEqual('fakeReferenceFieldValue');
  });

  it('does not post anything if no files are indicated as needing to be created', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.selectedFiles = [];

    service.postAttachments('workItemId', 'fakeReferenceFieldValue', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.deleteAttachment).not.toHaveBeenCalled();
  });

  it('can delete attachments using the PatientService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.deletedFilesList = [1,2,3];

    service.deleteAttachments('advocacyId', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment.calls.count()).toEqual(1);
    expect(mockPatientService.deleteAttachment.calls.first().args[0].svoIdArray).toEqual(fakeFileAttachmentData.deletedFilesList);

    expect(mockAdvocacyService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.deleteAttachment).not.toHaveBeenCalled();
  });

  it('can delete attachments using the AdvocacyService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.deletedFilesList = [1,2,3];

    service.deleteAttachments('appointmentId', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment).not.toHaveBeenCalled();

    expect(mockAdvocacyService.deleteAttachment.calls.count()).toEqual(1);
    expect(mockAdvocacyService.deleteAttachment.calls.first().args[0].svoIdArray).toEqual(fakeFileAttachmentData.deletedFilesList);

    expect(mockCustomerWorkitemService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.deleteAttachment).not.toHaveBeenCalled();
  });

  it('can delete attachments using the CustomerWorkitemService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.deletedFilesList = [1,2,3];

    service.deleteAttachments('customerWorkItemId', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.deleteAttachment).not.toHaveBeenCalled();

    expect(mockCustomerWorkitemService.deleteAttachment.calls.count()).toEqual(1);
    expect(mockCustomerWorkitemService.deleteAttachment.calls.first().args[0].svoIdArray).toEqual(fakeFileAttachmentData.deletedFilesList);

    expect(mockWorkitemService.deleteAttachment).not.toHaveBeenCalled();
  });

  it('can delete attachments using the WorkitemService', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.deletedFilesList = [1,2,3];

    service.deleteAttachments('workItemId', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.deleteAttachment).not.toHaveBeenCalled();

    expect(mockWorkitemService.deleteAttachment.calls.count()).toEqual(1);
    expect(mockWorkitemService.deleteAttachment.calls.first().args[0].svoIdArray).toEqual(fakeFileAttachmentData.deletedFilesList);
  });

  it('does not delete anything if no files are indicated as needing to be deleted', () => {
    const fakeFileAttachmentData = new FileAttachmentData();
    fakeFileAttachmentData.deletedFilesList = [];

    service.deleteAttachments('workItemId', fakeFileAttachmentData);

    expect(mockPatientService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockAdvocacyService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockCustomerWorkitemService.deleteAttachment).not.toHaveBeenCalled();
    expect(mockWorkitemService.deleteAttachment).not.toHaveBeenCalled();
  });
});
