import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Advocacy } from 'src/app/models/classes/advocacy';
import { environment } from 'src/environments/environment';
import {AttachmentTransmissionInterface} from "src/app/components/shared/file-attachments/attachment-transmission-interface";

@Injectable({
  providedIn: 'root'
})
export class AdvocacyService implements AttachmentTransmissionInterface {

  private baseUrl = environment.serviceUrl;
  private advocacyInfo: Advocacy;
  private routeTo: String;

  constructor(private http: HttpClient) { }

  public getAdvocacyInfo() {
    return this.advocacyInfo;
  }

  public setAdvocacyInfo(advocacy: Advocacy) {
    this.advocacyInfo = advocacy;
  }

  public setRouteTo(routeTo: String) {
    this.routeTo = routeTo;
  }

  public getRouteTo() {
    return this.routeTo;
  }

  getFacilityList(): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getApprovedFacilities');
  }

  getDrugList(): Observable<any> {
    return this.http.get(this.baseUrl + '/drug/getAll');
  }

  getIcdList(): Observable<any> {
    return this.http.get(this.baseUrl + '/icd/getAll');
  }

  getAllAdvocacyStatus(): Observable<any> {
    return this.http.get(this.baseUrl + '/advocacyStatus/getAll');
  }

  getAllAdvocacyTypes(): Observable<any> {
    return this.http.get(this.baseUrl + '/advocacyType/getAll');
  }

  getAllAppointmentTypes(): Observable<any> {
    return this.http.get(this.baseUrl + '/appointmentType/getAll');
  }

  getAllAppointmentStatus(): Observable<any> {
    return this.http.get(this.baseUrl + '/appointmentStatus/getAll');
  }

  getPagedAdvocaciesBySearchParam(params: any): Observable<any> {
      return this.http.get<any>(this.baseUrl + '/patient/advocacy/getPagedAdvocaciesBySearchParam'
       + '?advocacySearchParam=' + params.advocacySearchParam
       + '&pageNum=' + params.pageNum
       + '&pageSize=' + params.pageSize
       + '&orderBy=' + params.orderBy
      ).pipe(
        catchError(this.handleError)
      );
    }

  getAdvocacyMaintenanceSearchParamsForPagination(advMaintParams : any): Observable<any> {
    const params = new HttpParams()
    .set('patientMrnsearchParam', advMaintParams.patientMrnsearchParam)
    .set('facilityIdSearchParam', advMaintParams.facilityIdSearchParam)
    .set('advStatusIdSearchParam', advMaintParams.advStatusIdSearchParam)
    .set('pageNum', advMaintParams.pageNum)
    .set('pageSize', advMaintParams.pageSize)
    .set('orderBy', advMaintParams.orderBy)
    .set('pagination', advMaintParams.pagination);

    return this.http.get(this.baseUrl + '/patient/advocacyMaintenance/getAdvocacyMaintenanceSearchParamsForPagination', { params }).pipe(
      catchError(this.handleError)
    );
  }

  SearchForAllOpportunities(Searchvalue): Observable<any> {
    return this.http.get(this.baseUrl + '/advocacyOpportunity/getAdvocacyOpportunitiesBySearchParam?advocacyOpportunitySearchParam=' + Searchvalue)
  }

  SearchForOpportunities(searchParams : any): Observable<any> {
    const params = new HttpParams()
    .set('primaryInsuranceId', searchParams.primaryInsuranceId)
    .set('secondaryInsuranceId', searchParams.secondaryInsuranceId)
    .set('advocacyOpportunityTypeId', searchParams.advocacyOpportunityTypeId);

    return this.http.get(this.baseUrl + '/advocacyOpportunity/getAdvocacyOpportunities', { params }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdvOpp(oppId: any, userId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/advocacyOpportunity/delete?svoId=' + oppId + '&modifiedBy=' + userId).pipe(
      catchError(this.handleError)
    );
  }

  getPrimaryInsuranceList(): Observable<any> {
    return this.http.get(this.baseUrl + '/insurance/getPrimaryInsurance');
  }

  getSecondaryInsuranceList(): Observable<any> {
    return this.http.get(this.baseUrl + '/insurance/getSecondaryInsurance');
  }

  getAdvocacyOpportunityTypes(): Observable<any> {
    return this.http.get(this.baseUrl + '/advocacyOpportunityType/getAll');
  }

  createOpportunityType(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/advocacyOpportunity/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateOpportunityType(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/advocacyOpportunity/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  postAttachment(body: FormData): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post<any>(this.baseUrl + '/patient/appointment/attachment/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAttachment(params:any): Observable<any> {
    let httpParams = new HttpParams();
    params.svoIdArray.forEach((id) =>{
      httpParams = httpParams.append('svoIds', id);
    })

    httpParams = httpParams.append('modifiedBy', params.modifiedBy);

    return this.http.delete<any>(this.baseUrl +'/patient/appointment/attachment/delete', { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  getAttachmentById(id): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/appointment/attachment/downloadFile/' + id, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message="Something went wrong,Please check!";
       if(!!error.error.message){
         message = error.error.message;
     }
     return throwError(message);
   }

}


