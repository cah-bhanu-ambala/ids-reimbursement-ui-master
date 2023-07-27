import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import {AttachmentTransmissionInterface} from "src/app/components/shared/file-attachments/attachment-transmission-interface";

@Injectable({
  providedIn: 'root'
})
export class WorkitemService implements AttachmentTransmissionInterface {

  private baseUrl = environment.serviceUrl;
  private wItemInfo: any;

  constructor(private http: HttpClient, private httpService: HttpService) { }

  public getwItemInfo() {
    return this.wItemInfo;
  }

  public setwItemInfo(wItem: any) {
    if (wItem) {
      this.wItemInfo = wItem;
    }
  }

  public getAllTeamMembers(): Observable<any> {
    return this.http.get(this.baseUrl + '/user/getAll');
  }

  public getAllApprovalReasons(): Observable<any> {
    return this.http.get(this.baseUrl + '/priorAuthStatus/getAll');
  }

  getwiStatuses(): Observable<any> {
    return this.http.get(this.baseUrl + '/workitemStatus/getAll')
  }

  getApprovedFacilities(): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getApprovedFacilities');
  }

  getPrimaryIns(): Observable<any> {
    return this.http.get(this.baseUrl + '/insurance/getPrimaryInsurance')
  }

  getSecondaryIns() {
    return this.http.get(this.baseUrl + '/insurance/getSecondaryInsurance');
  }

  getbilligLevels(): Observable<any> {
    return this.http.get(this.baseUrl + '/facilityBillingLevel/getAll')
  }

  getBillingTypes(): Observable<any> {
    return this.http.get(this.baseUrl + '/facilityBillingType/getAll')
  }

  getWorkItemById(wiNumber: number): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/workitem/getById/' + wiNumber)
  }

    getWorkItemByIdAndFacilityId(wiNumber: number, facilityId:number): Observable<any> {
      return this.http.get(this.baseUrl + '/patient/workitem/getByWorkitemIdAndFacilityId?workitemId=' + wiNumber + "&facilityId="+facilityId);
    }

  getAttachmentById(id): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/workitem/attachment/downloadFile/' + id, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  getAllWorkItemsByFacilityId(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/workitem/getWorkItems'
     + '?facilityId=' + params.facilityId
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAllWorkItem(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/workitem/getWorkItems'
     + '?facilityId=' + params.facilityId
     + '&patientMrn=' + params.patientMrn
     + '&workItemStatusId=' + params.workItemStatusId
     + '&dateOut='+ params.dateOut
     + '&teamMemberId='+ params.teamMemberId
    ).pipe(
      catchError(this.handleError)
    );
  }

  getWorkItemsPage(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/workitem/getWorkItemsPage'
     + '?facilityId=' + (params.facilityId ?? "")
     + '&patientMrn=' + (params.patientMrn ?? "")
     + '&workItemStatusId=' + (params.workItemStatusId ?? "")
     + '&dateOut='+ (params.dateOut ?? "")
     + '&teamMemberId='+ (params.teamMemberId ?? "")
     + '&orderTypeId='+ (params.orderTypeId ?? "")
     + '&viewSearchParam='+ (params.viewSearchParam ?? "")
     + '&pageNum=' + params.pageNum
     + '&pageSize=' + params.pageSize
     + '&orderBy=' + params.orderBy
    ).pipe(
      catchError(this.handleError)
    );
  }

  searchViewWorkItem(searchParam: string): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/workitem/getViewWorkItems?searchParam=' + searchParam)
  }

  updateWorkItem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/patient/workitem/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createWorkItem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/patient/workitem/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postAttachment(body: FormData): Observable<any> {
    let headers= new HttpHeaders();
    return this.http.post<any>(this.baseUrl + '/patient/workitem/attachment/create',body,{headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteAttachment(params: any): Observable<any> {
    let httpParams = new HttpParams();
    params.svoIdArray.forEach((id) => {
      httpParams = httpParams.append('svoIds', id);
    });

    httpParams = httpParams.append('modifiedBy', params.modifiedBy);

    return this.http
      .delete<any>(this.baseUrl + '/patient/workitem/attachment/delete', {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  deleteWorkItem(params: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/patient/workitem/delete?svoId=' + params.workItemId + '&modifiedBy=' + params.userId).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllWorkItemsById(body: object, modifiedBy: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .request<any>('DELETE', this.baseUrl + '/patient/workitem/deleteAllById?modifiedBy=' + modifiedBy, { headers, body })
      .pipe(catchError(this.handleError));
  }

  getMrnFacilities(params): Observable<any>{
  return this.http.get(this.baseUrl + '/patient/getByMrnAndFacility?facilityId=' + params.facilityId
  + '&mrn=' + params.mrn);
  }

  SearchByICDCode(icdCode: string = null): Observable<any>{
    return this.http.get(this.baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode)
  }

  getProviderList(): Observable<any> {
    return this.http.get(this.baseUrl + '/provider/getAll')
  }

  getIcdDetails(term: string = null): Observable<any> {
    return this.httpService
      .getAll('icd/getByIcdCodeContainingIgnoreCase?icdCode=' + term)
      // .getAll('icd/getByIcdCodeContainingIgnoreCase2?icdCode=' + term)
      .pipe(map(resp => {
        if (resp.Error) {
          throwError(resp.Error);
        } else {
          return resp.map(o=> o.icdCode + ' - ' + o.description + ' - ' + o.icdId );
        }
      })
      );
  }

  getDrugDetails(term: string = null): Observable<any> {
    return this.httpService
      .getAll('drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam=' + term)
      .pipe(map(resp => {
        if (resp.Error) {
          throwError(resp.Error);
        } else {
          return resp.content.map(o=> o.drugProcCode + ' - ' + o.shortDesc + ' - ' + o.longDesc + ' - ' + o.drugId);;
        }
      })
      );
  }


  updateStatus(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/customerWorkItem/updateInternalWorkItemIdAndStatus', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getDenialTypes(): Observable<any> {
    return this.http.get(this.baseUrl + '/denialType/getAll');
  }

  getDenialTypeById(denialNumber: number): Observable<any> {
    return this.http.get(this.baseUrl + '/denialType/getById/' + denialNumber);
  }

   getOrderTypes(): Observable<any> {
      return this.http.get(this.baseUrl + '/orderType/getAll');
    }

  private handleError(error: HttpErrorResponse) {
    let message="Something went wrong,Please check!";
       if(!!error.error.message){
         message = error.error.message;
     }
     return throwError(message);
   }
}
