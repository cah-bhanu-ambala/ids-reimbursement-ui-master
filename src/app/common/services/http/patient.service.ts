import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {AttachmentTransmissionInterface} from "src/app/components/shared/file-attachments/attachment-transmission-interface";

@Injectable({
  providedIn: 'root',
})
export class PatientService implements AttachmentTransmissionInterface {
  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) {}

  updateAdvocacy(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.http
      .put<any>(this.baseUrl + '/patient/advocacy/update', body, { headers })
      .pipe(catchError(this.handleError));
  }

  createAdvocacy(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.http
      .post<any>(this.baseUrl + '/patient/advocacy/create', body, { headers })
      .pipe(catchError(this.handleError));
  }

  postAttachment(body: FormData): Observable<any> {
    let headers = new HttpHeaders();
    return this.http
      .post<any>(this.baseUrl + '/patient/advocacy/attachment/create', body, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getAttachmentById(id): Observable<any> {
    return this.http
      .get(this.baseUrl + '/patient/advocacy/attachment/downloadFile/' + id, {
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  deleteAttachment(params: any): Observable<any> {
    let httpParams = new HttpParams();
    params.svoIdArray.forEach((id) => {
      httpParams = httpParams.append('svoIds', id);
    });

    httpParams = httpParams.append('modifiedBy', params.modifiedBy);

    return this.http
      .delete<any>(this.baseUrl + '/patient/advocacy/attachment/delete', {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  searchPatientByAny(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/workitem/drugCode/findWorkItemDrugCodeByAdvocacyNeeded?' + 
    'facilityId=' + params.facilityId + 
    '&patientMrn=' + params.mrn + 
    '&advocacyNeeded=' + params.advocacyNeeded + 
    '&pageNum=' + params.pageNum + 
    '&pageSize=' + params.pageSize);
  }

  getAdvocaciesByFacilityId(params: any): Observable<any> {
    let apiParam = params.facilityIds+ '&patientMrn=' + (params.mrn || '') +  '&advocacyStatusIds=' + (params.advocacyStatusIds || '');
    let url = this.baseUrl + '/patient/advocacy/getAdvocacies?facilityIds=' + apiParam;
    return this.http.get<any>(url);
  }

  deleteAdvocacyById(params: any): Observable<any> {
    let url =
      this.baseUrl +
      '/patient/advocacy/delete?svoId=' +
      params.svoId +
      '&modifiedBy=' +
      params.modifiedBy;

    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  getAdvocacyById(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/patient/advocacy/getById/' + id);
  }

  getAppointmentByPatientId(id: any): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + '/patient/appointment/getAllAppointmentsByAdvocacyId/' + id
    );
  }

  getAppointmentByPatientIdExcludeClosed(id: any): Observable<any> {
      return this.http.get<any>(
        this.baseUrl + '/patient/appointment/getAllAppointmentsByAdvocacyIdExcludeClosed/' + id
      );
    }

  updateAppointment(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .put<any>(this.baseUrl + '/patient/appointment/update', body, { headers })
      .pipe(catchError(this.handleError));
  }

  createAppointment(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .post<any>(this.baseUrl + '/patient/appointment/create', body, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  deleteAppointmentById(params: any): Observable<any> {
    let url =
      this.baseUrl +
      '/patient/appointment/delete?svoId=' +
      params.svoId +
      '&modifiedBy=' +
      params.modifiedBy;

    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  rejectRequestToDelete(body: object): Observable<any> {
    let url =
      this.baseUrl + '/patient/appointment/rejectRequestToDelete';
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(url, body, {headers}).pipe(catchError(this.handleError));
  }

  getPrimaryInsuranceList(): Observable<any> {
    return this.http.get(this.baseUrl + '/insurance/getPrimaryInsurance');
  }

  getSecondaryInsuranceList(): Observable<any> {
    return this.http.get(this.baseUrl + '/insurance/getSecondaryInsurance');
  }

  getFacilityList(): Observable<any> {
    return this.http.get(this.baseUrl + '/facility/getApprovedFacilities');
  }

  getContactStatus(): Observable<any> {
    return this.http.get(this.baseUrl + '/contactStatus/getAll');
  }

  getFirstOutcomeList(): Observable<any> {
    return this.http.get(this.baseUrl + '/contactOutcome/getFirstOutcomeTypes');
  }

  getSecondtOutcomeList(): Observable<any> {
    return this.http.get(
      this.baseUrl + '/contactOutcome/getSecondOutcomeTypes'
    );
  }

  getThirdOutcomeList(): Observable<any> {
    return this.http.get(this.baseUrl + '/contactOutcome/getThirdOutcomeTypes');
  }

  searchByFacilityAndMrn(searchValue: string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        '/patient/getPatientsBySearchParam?patientSearchParam=' +
        searchValue
    );
  }

  updatePatient(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .put<any>(this.baseUrl + '/patient/update', body, { headers })
      .pipe(catchError(this.handleError));
  }

  updatePatientInfoInCustomerWorkItem(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/customerWorkItem/updatePatientInfo', body, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  createPatient(body: object): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .post<any>(this.baseUrl + '/patient/create', body, { headers })
      .pipe(catchError(this.handleError));
  }

  getByPatientId(patientId: any): Observable<any> {
    return this.http.get(this.baseUrl + '/patient/getById/' + patientId);
  }

  getClinicRespondedPatients(params): Observable<any>{
    return this.http.get(this.baseUrl + '/patient/getClinicRespondedPatients?facilityId=' + params.facilityId
    + '&mrn=' + params.mrn);
  }

  deleteAllPatientsById(body: object, modifiedBy: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .request<any>('DELETE', this.baseUrl + '/patient/deleteAllById?modifiedBy=' + modifiedBy, { headers, body })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong,Please check!';
    if (!!error?.error?.message) {
      message = error.error.message;
    }
    return throwError(message);
  }
}
