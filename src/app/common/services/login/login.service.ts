import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from 'src/app/common/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpService {

  setPassData: any;
  securityAnswer: any;

  readonly toggleLogin$ = new Subject<string>();

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  toggle(mode: string): void {
    this.toggleLogin$.next(mode);
  }

  resetPassword(data): Observable<any> {
    const url = '/okta/user/resetPassword';
    return this.postData<any>(url, data);
  }

  setPassword(data): Observable<any> {
    const url = '/okta/user/setPassword';
    return this.postData<any>(url, data);
  }

  getSecurityQuestions(code: string): Observable<any> {
    return this.get<any>(`/okta/user/securityQuestions/${code}`);
  }

  submitSecurityAnswer(userName: string, data: any): Observable<any> {
    const url = `/okta/user/factor/question/save/${userName}`;
    return this.postData<any>(url, data);
  }

}
