import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { DrugOrProc } from 'src/app/models/classes/drug-or-proc';

@Injectable({
  providedIn: 'root'
})
export class DrugprocService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient) { }

  getDrugsByCode(drugCode: string): Observable<any> {
    return this.http.get(this.baseUrl + '/drug/getByDrugProcCode?drugProcCode='+ drugCode);
  }

  updateDrugProc(drugOrProc: DrugOrProc): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.baseUrl + '/drug/update/', drugOrProc, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  searchByDrugProc(drugCode: any, pageNum: any, pageSize: any): Observable<any> {
    const params = new URLSearchParams();
    params.set('drugSearchParam', drugCode);
    params.set('pageNum', pageNum);
    params.set('pageSize', pageSize);
    params.set('pagination', "true");
    return this.http.get(this.baseUrl + `/drug/findByProcCodeDescContainingIgnoreCase?${params.toString()}`);
  }

  deleteDrugProc(drugId: any, userId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/drug/delete?svoId=' + drugId + '&modifiedBy=' + userId).pipe(
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
