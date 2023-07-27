import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerReportsService {
  private baseUrl = environment.serviceUrl;
  constructor(private http: HttpClient) { }

  getCustomerOrderCompletedReport(params: any) {  
    return this.http.get<any>(`${this.baseUrl}/patient/workitem/getCustomerOrderCompletedReport?facilityId=${
      params.facilityId}&dateOutFrom=${params.dateOutFrom}&dateOutTo=${
    params.dateOutTo}`).pipe(
    catchError(this.handleError));
  }

  getAdvocacyOrderTypeReport(params: any) {    
    return this.http.get<any>(this.baseUrl + '/patient/advocacy/getCustomerAdvocacyTypeReport?facilityId=' + params.facilityId + '&dateCreatedFrom=' + params.dateOutFrom + '&dateCreatedTo=' + params.dateOutTo ).pipe(
      catchError(this.handleError));
  }

  getSecureAdvocacyReport(params: any) {    
    return this.http.get<any>(this.baseUrl + '/patient/advocacy/getCustomerSecuredAdvocacyReport?facilityId=' + params.facilityId + '&patientMrn=' + params.mrn + '&dateCreatedFrom=' + params.dateOutFrom + '&dateCreatedTo=' + params.dateOutTo ).pipe(
      catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) { 
    
    let message="Something went wrong,Please check.";
       if(!!error.error.message){
         message = error.error.message;
     } 
     return throwError(message);
   } 
}
