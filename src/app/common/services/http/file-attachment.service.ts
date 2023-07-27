import { Injectable } from '@angular/core';
import {PatientService} from "./patient.service";
import {AdvocacyService} from "./advocacy.service";
import {CustomerWorkitemService} from "./customer-workitem.service";
import {WorkitemService} from "./workitem.service";
import {Observable, EMPTY} from "rxjs";
import {FileAttachmentData} from "src/app/components/shared/file-attachments/file-attachment-data";
import {AttachmentTransmissionInterface} from "src/app/components/shared/file-attachments/attachment-transmission-interface";

@Injectable({
  providedIn: 'root'
})
export class FileAttachmentService {
  attachmentTransmissionInterfaceMap = new Map<string, AttachmentTransmissionInterface>();

  constructor(private patientService: PatientService,
              private advocacyService: AdvocacyService,
              private customerWorkitemService: CustomerWorkitemService,
              private workitemService: WorkitemService) {

    /*
    Note: This is the best strategy I could devise to consolidate the file attachment logic for API calls.
    I would recommend that a singular API (and singular data table) be setup which has a file type field
    to note the 4 different types that are at present independently managed.
    */
    this.attachmentTransmissionInterfaceMap.set('workItemId', workitemService);                 // /patient/workitem/attachment/create
    this.attachmentTransmissionInterfaceMap.set('customerWorkItemId', customerWorkitemService); // /customerWorkItem/attachment/create

    // It's weird that these two services have keys like this but in checking it is indeed setup in this manner.
    this.attachmentTransmissionInterfaceMap.set('advocacyId', patientService);                  // /patient/advocacy/attachment/create
    this.attachmentTransmissionInterfaceMap.set('appointmentId', advocacyService);              // /patient/appointment/attachment/create
  }

  postAttachments(referenceFieldIdName: string,
                  referenceFieldIdValue: string,
                  fileAttachmentData: FileAttachmentData): Observable<any> {
    if (fileAttachmentData.selectedFiles.length === 0) {
      return EMPTY;
    }
    let formData = new FormData();
    fileAttachmentData.selectedFiles.forEach(selectedFile => {
      formData.append('files', selectedFile.file, selectedFile.file.name);
    });

    formData.append('modifiedBy', localStorage.userId);
    formData.append('createdBy', localStorage.userId);
    formData.append(referenceFieldIdName, referenceFieldIdValue);

    return this.attachmentTransmissionInterfaceMap.get(referenceFieldIdName).postAttachment(formData);
  }

  deleteAttachments(referenceFieldIdName: string, fileAttachmentData: FileAttachmentData): Observable<any> {
    if (fileAttachmentData.deletedFilesList.length === 0) {
      return EMPTY;
    }
    return this.attachmentTransmissionInterfaceMap.get(referenceFieldIdName).deleteAttachment({
      svoIdArray :fileAttachmentData.deletedFilesList,
      modifiedBy: localStorage.userId
    });
  }
}
