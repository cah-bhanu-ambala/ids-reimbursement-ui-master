import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  getFacilities(): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getAll')
  }

  getBillingLevels(): Observable<any> {
    return this.http.get(this.baseUrl + '/facilityBillingLevel/getAll')
  }

  searchByFacilityName(facilityName: string): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getByFacilityName?facilityName='+ facilityName);
  }

  getById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getById/' + id)
  }

  updateFacility(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/facility/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createFacility(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/facility/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateFacilityStatus(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/facility/updateStatus', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFacility(params: any): Observable<any> {
    let url =
      this.baseUrl +
      '/facility/delete?svoId=' +
      params.svoId +
      '&modifiedBy=' +
      params.modifiedBy;

    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  getPendingFacilities(): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getPendingFacilities')
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    console.log(error.error.message);
    if(error.error.message === undefined){
      error.error.message ="Something went wrong,Please check"
    }
    return throwError(error.error.message);
  }
}
