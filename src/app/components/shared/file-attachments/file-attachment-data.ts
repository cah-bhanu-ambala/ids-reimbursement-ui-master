export class FileAttachmentData {
  filesList: Array<any> = []; // list of all files
  selectedFiles: Array<any> = []; // list of files only found in the ui
  deletedFilesList: Array<any> = []; // files that are to be removed from the db
}
