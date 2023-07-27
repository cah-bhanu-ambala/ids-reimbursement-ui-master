import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Facility } from 'src/app/models/classes/facility';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  approveFacility(endpoint: string, body: object)
  {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    
    return this.http.put<any>(`${this.baseUrl}/${endpoint}`, body, { headers }).pipe(
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