import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrugAdvocacyService {
  private baseUrl = environment.serviceUrl;

  constructor(private http:HttpClient) { }

  getAllAdvocacies(): Observable<any> {
    return this.http.get(this.baseUrl + '/drugAdvocacy/getAll');
  }

  drugAdvocacyHasClearance(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/drugAdvocacy/drugAdvocacyHasClearance'
     + '?drugIdAdvocacyId=' + params.drugAdvocacyId
    ).pipe(
      catchError(this.handleError)
    );
  }


  getAllAdvocaciesBySearchParam(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/drugAdvocacy/getdrugAdvocacyBySearchParam'
     + '?drugId=' + params.drugId
     + '&icdCode=' + params.icdCode
     + '&primaryInsuranceId=' + params.primaryInsuranceId
     + '&secondaryInsuranceId='+ params.secondaryInsuranceId
     + '&priorAuthStatusId='+ params.priorAuthStatusId
     + '&copay='+ params.copay
     + '&premium='+ params.premium
    ).pipe(
      catchError(this.handleError)
    );
  }

  createAdvocacy(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/drugAdvocacy/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateAdvocacy(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/drugAdvocacy/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdvocacyByDrugId(params: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/drugAdvocacy/delete?svoId='  +
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
