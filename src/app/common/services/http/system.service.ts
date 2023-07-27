import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  getSystems(): Observable<any> {
    return this.http.get(this.baseUrl + '/system/getAll');
  }

  getApprovedSystems(): Observable<any> {
    return this.http.get(this.baseUrl + '/system/getApprovedSystems');
  }

 getPendingSystems(): Observable<any> {
    return this.http.get(this.baseUrl + '/system/getPendingSystems');
  }
  createSystem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/system/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateSystem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/system/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  updateSystemStatus(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/system/updateStatus', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  searchBySystemName(systemName: string): Observable<any> {
      return this.http.get(this.baseUrl + '/system/getBySystemName?systemName='+ systemName);
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
