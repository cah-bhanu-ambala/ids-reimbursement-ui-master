import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  searchContact(contactName: string): Observable<any> {
    return this.http.get(this.baseUrl + '/contact/getByContactName?contactName=' + contactName)
  }

  getAllContacts(): Observable<any> {
    return this.http.get(this.baseUrl + '/contactType/getAll')
  }

  updateContact(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/contact/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteContact(params: any): Observable<any> {
       return this.http.delete<any>(this.baseUrl + '/contact/delete?svoId='  +
          params.svoId +
          '&modifiedBy=' +
          params.modifiedBy).pipe(
            catchError(this.handleError)
          );
    }

  createContact(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/contact/create', body, { headers }).pipe(
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
