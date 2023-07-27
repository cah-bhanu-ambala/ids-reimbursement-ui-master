import {Observable} from "rxjs";

export interface AttachmentTransmissionInterface {
  getAttachmentById(id): Observable<any>;
  postAttachment(body: FormData): Observable<any>;
  deleteAttachment(params: any): Observable<any>;
}
