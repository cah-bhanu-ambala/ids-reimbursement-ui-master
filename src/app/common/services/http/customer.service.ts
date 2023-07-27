import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) {}

  getPatientNotRespondedStatusPatients(params: any): Observable<any> {
    let url = this.baseUrl +
              '/patient/getPatientNotRespondedStatusPatients?facilityId=' + params.facilityId +
              '&mrn=' + params.mrn;
    return this.http.get<any>(url);
  }

  getAllAppointmentsByAdvocacyIdForExternalCustomer(id:any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/appointment/getAllAppointmentsByAdvocacyIdForExternalCustomer/'+id );
  }
  getOpenAppointmentsByAdvocacyIdForExternalCustomer(id:any): Observable<any> {
      return this.http.get<any>(this.baseUrl + '/patient/appointment/getOpenAppointmentsByAdvocacyIdForExternalCustomer/'+id );
    }

  SearchForCustAdvocacies(advocacySearchParam: string, facilityId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/advocacy/getAdvocaciesByFacilityIdUserRoleAndSearchParam?facilityId=' + facilityId +
      '&advocacySearchParam=' + advocacySearchParam );
  }

  updatePatient(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/patient/updatePatient', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppointmentByCust(params:any): Observable<any> {
    let url=this.baseUrl +
    '/patient/appointment/requestToDelete?svoId=' +params.svoId +'&modifiedBy='+params.modifiedBy ;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(url, null, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message="Something went wrong,Please check.";
       if(!!error?.error?.message){
         message = error.error.message;
     }
     return throwError(message);
   }
}
