import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private baseUrl = environment.serviceUrl;

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient) {  }

  getUserDetails(userEmail: string): Observable<any> {
    return this.http.get(this.baseUrl + `/user/getUserDetails/${userEmail}`);
  }


}
