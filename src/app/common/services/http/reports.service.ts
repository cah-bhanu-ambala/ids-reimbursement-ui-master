import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BossInvoice } from 'src/app/models/classes/boss-invoice';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

   getAllFacilities(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/facility/getApprovedFacilities').pipe(
      catchError(this.handleError));
  }

  getAllAdvocacyTypes(): Observable<any> {
    return this.http.get<any>(this.baseUrl+ '/advocacyType/getAll').pipe(
      catchError(this.handleError));
  }
 getTeamMemberList(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl+ '/user/getTeamMemberList?userId=' + params.userId).pipe(
    catchError(this.handleError));
  }

  getDelinquencyDetails(params: any) {
      return this.http.get<any>(this.baseUrl+ '/patient/workitem/getDelinquencyWorkItems?facilityIds=' + params.facilityIds +
      '&dateIn=' + params.dateIn + '&userId=' + params.userId).pipe(
      catchError(this.handleError));
  }

  getSummaryDetails(params: any) {
    let teamMembersIdsParameter = '&teamMembersIds=' + params.teamMembersIds;
    teamMembersIdsParameter = params.teamMembersIds ? teamMembersIdsParameter : '';
    return this.http.get<any>(this.baseUrl+ '/patient/workitem/getWorkItemSummaryReport?facilityIds=' + params.facilityIds +
    '&fromDate=' + params.fromDate + '&toDate=' + params.toDate + '&dateType=' + params.dateType + teamMembersIdsParameter + '&userId=' + params.userId).pipe(
    catchError(this.handleError));
  }

  getAdvocacyAlalysisDetails(params: any) {
    let advocacyTypeIdsParameter = '&advocacyTypeIds=' + params.advocacyTypeIds;
    advocacyTypeIdsParameter = params.advocacyTypeIds ? advocacyTypeIdsParameter : '';
    return this.http.get<any>(this.baseUrl+ '/patient/advocacy/getAdvocacyAnalysisReport?facilityIds=' + params.facilityIds +
    advocacyTypeIdsParameter + '&dateCreatedFrom=' + params.dateCreatedFrom + '&dateCreatedTo=' +
    params.dateCreatedTo + '&userId=' + params.userId).pipe(
    catchError(this.handleError));
  }

  getAdvocacyReport(params: any) {
    let advocacyTypeIdsParameter = '&advocacyTypeIds=' + params.advocacyTypeIds;
    advocacyTypeIdsParameter = params.advocacyTypeIds ? advocacyTypeIdsParameter : '';
    return this.http.get<any>(this.baseUrl+ '/patient/advocacy/getAdvocacyAnalysisReport?facilityIds=' + params.facilityIds +
    advocacyTypeIdsParameter + '&dateCreatedFrom=' + params.dateCreatedFrom + '&dateCreatedTo=' +
    params.dateCreatedTo + '&userId=' + params.userId).pipe(
    catchError(this.handleError));
  }
 getAdvocacyBillingReport(params:any) {
    return this.http.get<any>(this.baseUrl+ '/patient/advocacy/getAdvocacyBillingReport?wbsNames=' + params.wbsNames +
    '&dateOutFrom=' + params.dateOutFrom + '&dateOutTo=' + params.dateOutTo ).pipe(
    catchError(this.handleError));
}

  getBillingDetails(params:any) {
    return this.http.get<any>(this.baseUrl+ '/patient/workitem/getBillingReport?facilityIds=' + params.facilityIds +
    '&dateOutFrom=' + params.dateOutFrom + '&dateOutTo=' + params.dateOutTo + '&userId=' + params.userId).pipe(
    catchError(this.handleError));
}

getBossInvoiceDetails(params: BossInvoice) {
  return this.http.post<any>(this.baseUrl+ '/patient/workitem/getBossBillingReport', params).pipe(
  catchError(this.handleError));
}

getFacilityBillingDetails(params: BossInvoice) {
  return this.http.post<any>(this.baseUrl+ '/facility/workitem/getFacilityBillingReport', params).pipe(
  catchError(this.handleError));
}
  getWorkstatusDetails(params:any) {
    return this.http.get<any>(this.baseUrl+ '/patient/workitem/getWorkItemStatusReport?facilityIds=' + params.facilityIds + '&userId=' + params.userId+
                                             '&fromDate=' + params.fromDate + '&toDate=' + params.toDate).pipe(
    catchError(this.handleError));
}

  getdeletedWorkItemDetails(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/workitem/getDeletedWorkItems'
      + '?facilityIds=' + params.facilityIds
      + '&dateFrom=' + params.dateOutFrom
      + '&dateTo=' + params.dateOutTo
    ).pipe(
      catchError(this.handleError)
    )
  }


private handleError(error: HttpErrorResponse) {

  let message="Something went wrong,Please check!";
     if(!!error.error){
       message = error.error.message;
   }
   return throwError(message);
 }
}

