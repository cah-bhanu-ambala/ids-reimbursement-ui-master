import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _baseUrl = environment.serviceUrl;
  public getUrl(endpoint: string): string {
    return `${this._baseUrl}/${endpoint}`;
  }

  constructor(public readonly http: HttpClient) { }

  get<T>(url: string, options?: object): Observable<T> {
    url = this._baseUrl.concat(url);
    return this.http.get<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, body?: object, options?: object): Observable<T> {
    url = this._baseUrl.concat(url);
    return this.http.put<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  getByCode(endpoint: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${this.getUrl(endpoint)}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  postData<T>(url: string, body?: object, options?: object): Observable<T> {
    url = this._baseUrl.concat(url);
    return this.http.post<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  getAll(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.getUrl(endpoint)}`).pipe(
      catchError(this.handleError)
    );
  }

  post(endpoint: string, body: object, isUpdate: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (isUpdate) {
      return this.http.put<any>(`${this.getUrl(endpoint)}`, body, { headers }).pipe(
        catchError(this.handleError)
      );
    }
    else {
      return this.http.post<any>(`${this.getUrl(endpoint)}`, body, { headers }).pipe(
        catchError(this.handleError)
      );
    }

  }

  postAttachment(endpoint: string, body: FormData): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post<any>(`${this.getUrl(endpoint)}`, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  searchByAny(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.getUrl(endpoint)}`).pipe(
      catchError(this.handleError)
    );
  }

  delete(endpoint: string): Observable<any> {

    return this.http.delete<any>(`${this.getUrl(endpoint)}`).pipe(
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
