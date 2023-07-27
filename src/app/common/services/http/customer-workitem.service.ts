import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import {AttachmentTransmissionInterface} from "src/app/components/shared/file-attachments/attachment-transmission-interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerWorkitemService implements AttachmentTransmissionInterface {

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

  getwiStatuses(): Observable<any> {
    return this.http.get(this.baseUrl + '/customerWorkItemStatus/getAll')
  }

  //This is for customer entered work items
  getCustomerSubmittedWorkItem(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/customerWorkItem/getCustomerEnteredWorkItems'
      + '?facilityIds=' + params.facilityIds
      + '&statusIds=' + params.statusIds
    ).pipe(
      catchError(this.handleError)
    );
  }

  createCustomerWorkItem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/customerWorkItem/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postAttachment(body: FormData): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post<any>(this.baseUrl + '/customerWorkItem/attachment/create', body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAttachment(params:any): Observable<any> {
    let httpParams = new HttpParams();
    params.svoIdArray.forEach((id) =>{
      httpParams = httpParams.append('svoIds', id);
    })

    httpParams = httpParams.append('modifiedBy', params.modifiedBy);

    return this.http.delete<any>(this.baseUrl +'/customerWorkItem/attachment/delete', { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  requestToDeleteCustomerWorkItem(params: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/customerWorkItem/requestToDelete?svoId=' + params.svoid + '&modifiedBy=' + params.modifiedBy, null, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCustomerWorkItem(params: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/customerWorkItem/delete?svoId=' + params.customerWorkItemId + '&modifiedBy=' + params.modifiedBy)
    .pipe(
      catchError(this.handleError)
    );
  }

  SearchByICDCode(icdCode: string = null): Observable<any> {
    return this.http.get(this.baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode)
  }

  getProviderList(): Observable<any> {
    return this.http.get(this.baseUrl + '/provider/getAll')
  }

  getIcdDetails(term: string = null): Observable<any> {
    return this.httpService
      .getAll('icd/getByIcdCodeContainingIgnoreCase?icdCode=' + term)
      .pipe(map(resp => {
        if (resp.Error) {
          throwError(resp.Error);
        } else {
          return resp.map(o => o.icdCode + ' - ' + o.description + ' - ' + o.icdId);
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
          return resp.content.map(o => o.drugProcCode + ' - ' + o.shortDesc + ' - ' + o.longDesc + ' - ' + o.drugId);;
        }
      })
      );
  }

  getProviders(term: string = null): Observable<any> {
    return this.httpService
      .getAll('provider/getByProviderAndNpi?providerNpi=' + term)
      .pipe(map(resp => {
        if (resp.Error) {
          throwError(resp.Error);
        } else {
          return resp.map(o => o.providerFirstName + '-' + o.providerLastName + '-' + o.npi + '-' + o.providerId);
        }
      })
      );
  }

  getSubmittedCustomerWorkItems(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/customerWorkItem/getSubmittedWorkItems'
      + '?facilityId=' + params.facilityId
       + '&patientMrn=' + params.patientMrn
       + '&whoAdded=' + params.whoAdded
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAttachmentById(id): Observable<any> {
    return this.http.get(this.baseUrl + '/customerWorkItem/attachment/downloadFile/' + id, { responseType: 'blob' });
  }

  createMRN(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/patient/createMRN', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCustomerWorkItem(customerWorkItemId: number): Observable<any>{
    return this.http.get(this.baseUrl + '/customerWorkItem/getById/' + customerWorkItemId)
  }

  private handleError(error: HttpErrorResponse) {
    let message="Something went wrong,Please check!";
       if(!!error.error.message){
         message = error.error.message;
     }
     return throwError(message);
   }
}
