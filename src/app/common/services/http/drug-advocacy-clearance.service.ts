import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrugAdvocacyClearanceService {
  private baseUrl = environment.serviceUrl;

  constructor(private http:HttpClient) { }

  getAllAdvocacies(): Observable<any> {
    return this.http.get(this.baseUrl + '/drugAdvocacyClearance/getAll');
  }

  getAllAdvocaciesWithClearanceBySearchParam(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/drugAdvocacyClearance/getDrugAdvocacyClearanceBySearchParam'
     + '?drugId=' + params.drugId
     + '&icdCode=' + params.icdCode
     + '&primaryInsuranceId=' + params.primaryInsuranceId
     + '&secondaryInsuranceId='+ params.secondaryInsuranceId
     + '&priorAuthStatusId='+ params.priorAuthStatusId
    ).pipe(
      catchError(this.handleError)
    );
  }

  createAdvocacyWithClearance(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/drugAdvocacyClearance/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateAdvocacyWithClearance(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/drugAdvocacyClearance/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdvocacyClearanceByDrugId(params: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/drugAdvocacyClearance/delete?svoId='  +
    params.svoId +
    '&modifiedBy=' +
    params.modifiedBy).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Sorry, Something went wrong!';
    if (!!error?.error?.message && !error.error.message.includes("could not execute statement")) {
      message = error.error.message;
    }
    return throwError(message);
  }
}
