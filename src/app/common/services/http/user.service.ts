import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any>{
    return this.http.get(this.baseUrl + '/user/getAll');
  }
  getUserRole(): Observable<any> {
    return this.http.get(this.baseUrl + '/userRole/getAll');
  }

  getFacilityList(): Observable<any> {
      return this.http.get(this.baseUrl + '/facility/getApprovedFacilities');
  }

  getReportingUserList(url): Observable<any> {
      return this.http.get(this.baseUrl + '/user/'+ url);
  }

  onSearch(Searchvalue): Observable<any> {
      return this.http.get(this.baseUrl + '/user/getByUserNameAndEmail?userNameEmail=' + Searchvalue)
  }

 updateUser(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/user/update', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.baseUrl + '/user/create', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getUserDetails(userEmail: string): Observable<any> {
    return this.http.get(this.baseUrl + `/user/getUserDetails/${userEmail}`);
  }

   private handleError(error) {
    let message="Something went wrong,Please check!";
      if(!!error.error.message){
        message = error.error.message;
    }
    return throwError(message);
  }

  getBySystemId(systemId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/user/getBySystemId?systemId=" + systemId);
  }

  getInternalUsers(): Observable<any> {
    return this.http.get(this.baseUrl + "/user/getAllInternalUsers");
  }

  getExternalUsers(): Observable<any> {
    return this.http.get(this.baseUrl + "/user/getExternalRoleUsers");
  }
}
