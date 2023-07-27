import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  searchProvider(providerNpi: string): Observable<any> {
    return this.http.get(this.baseUrl + '/provider/getByProviderAndNpi?providerNpi=' + providerNpi)
  }

  updateProvider(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');   
    return this.http.put<any>(this.baseUrl + '/provider/update', body, { headers }).pipe(
      catchError(this.handleError)
    );    
  }

  createProvider(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');   
    return this.http.post<any>(this.baseUrl + '/provider/create', body, { headers }).pipe(
      catchError(this.handleError)
    );    
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    console.log(error.error.message);   
    if(error.error.message === undefined){
      error.error.message ="Something went wrong,Please check"
    };
    return throwError(error.error.message);
  }
}
