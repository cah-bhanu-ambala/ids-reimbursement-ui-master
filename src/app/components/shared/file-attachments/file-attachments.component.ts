import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import {FileAttachmentData} from "./file-attachment-data";
import {AttachmentTransmissionInterface} from "./attachment-transmission-interface";
import {PatientService} from "../../../common/services/http/patient.service";
import {AdvocacyService} from "../../../common/services/http/advocacy.service";
import {CustomerWorkitemService} from "../../../common/services/http/customer-workitem.service";
import {WorkitemService} from "../../../common/services/http/workitem.service";

@Component({
  selector: 'app-file-attachments',
  templateUrl: './file-attachments.component.html',
  styleUrls: ['./file-attachments.component.scss']
})
export class FileAttachmentsComponent implements OnInit {
  @Input() attachmentTransmissionInterfaceName: String;
  @Input() fileAttachmentData: FileAttachmentData;
  @Input() maxAttachments = 3;
  @Output() fileAttachmentsChanged = new EventEmitter<FileAttachmentData>();
  attachmentTransmissionInterface: AttachmentTransmissionInterface;
  localizedWindow = window; // So that this can be mocked to avoid actual files being opened during tests

  constructor(private toastr: ToastrService,
              private patientService: PatientService,
              private advocacyService: AdvocacyService,
              private customerWorkitemService: CustomerWorkitemService,
              private workitemService: WorkitemService) { }

  ngOnInit(): void {
    this.setupAttachmentHttpTransmissionInterface();
  }

  setupAttachmentHttpTransmissionInterface() {
    /*
    Note: This is the best strategy I could devise to consolidate the file attachment UI logic.
    I would recommend that a singular API (and singular data table) be setup which has a file type field
    to note the 4 different types that are at present independently managed.
     */
    switch (this.attachmentTransmissionInterfaceName) {
      case "PatientService":
        this.attachmentTransmissionInterface = this.patientService;
        break;
      case "AdvocacyService":
        this.attachmentTransmissionInterface = this.advocacyService;
        break;
      case "CustomerWorkitemService":
        this.attachmentTransmissionInterface = this.customerWorkitemService;
        break;
      case "WorkitemService":
        this.attachmentTransmissionInterface = this.workitemService;
        break;
    }
  }

  addAttachment($event, type) {
    const maxFileSize = 10 * 1024 * 1024;
    for (let i = 0; i < $event.target.files.length; i++) {
      let file = $event.target.files[i];
      if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type == 'image/png'
        || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || file.type === 'application/msword') {
        if (this.fileAttachmentData.filesList.length < this.maxAttachments) {
          let isDuplicate = false;
          //check for duplicate in new list
          this.fileAttachmentData.selectedFiles.forEach(f => {
            if (f.file.name === file.name) {
              this.showInfo('Attachment ' + file.name + ' has been already added');
              isDuplicate = true;
              return;
            }
          });
          //check for duplicate in db's list
          this.fileAttachmentData.filesList.forEach(f => {
            if (f.name === file.name) {
              this.showInfo('Attachment ' + file.name + ' has been already added');
              isDuplicate = true;
              return;
            }
          });

          if (!isDuplicate) {
            if (file.size > maxFileSize) {
              this.showInfo('The file exceeded the maximum allowed file size limit');
            } else {
              this.fileAttachmentData.selectedFiles.push({ type, file: file });
              this.fileAttachmentData.filesList.push({ name: file.name, attachmentId: null });
            }
          }
        }
        else {
          this.showInfo("You can only add " +  this.maxAttachments + " attachments!");
        }
      } else {
        this.showInfo("Attachment need to be PDF/Doc/Image type files!");
      }
    }
    this.fileAttachmentsChanged.emit(this.fileAttachmentData);
  }

  deleteSelectedFile(idx, attachmentId) {
    const fileNameBeingDeleted = this.fileAttachmentData.filesList[idx].name;
    this.fileAttachmentData.filesList.splice(idx, 1);
    if (!attachmentId) {
      this.fileAttachmentData.selectedFiles = this.fileAttachmentData.selectedFiles.filter(f => f.file.name !== fileNameBeingDeleted);
    }
    else {
      this.fileAttachmentData.deletedFilesList.push(attachmentId);
    }
    this.fileAttachmentsChanged.emit(this.fileAttachmentData);
  }

  openFile(id, name) {
    //new attachment
    if (id) {
      this.attachmentTransmissionInterface.getAttachmentById(id).subscribe(
        (response) => {
          let mediaType = response.type;
          let blob = new Blob([response], { type: mediaType });
          let url = this.localizedWindow.URL.createObjectURL(blob);
          if (mediaType == 'application/pdf' || mediaType == 'image/jpeg' || mediaType == 'image/png') {
            this.localizedWindow.open(url);
          } else {
            saveAs(blob, name);
          }
        }, err => {
          this.showFailure('Failed to Open the file!');
          console.log(err);
        });
    } else {
      let file = this.fileAttachmentData.selectedFiles.filter(f => f.file.name == name)[0];
      let blob = file.file;
      let url = this.localizedWindow.URL.createObjectURL(blob);
      let mediaType = file.file.type;
      if (mediaType == 'application/pdf' || mediaType == 'image/jpeg' || mediaType == 'image/png') {
        this.localizedWindow.open(url);
      } else {
        saveAs(blob, name);
      }
    }
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }

  showInfo(msg) {
    this.toastr.info(msg);
  }
}
