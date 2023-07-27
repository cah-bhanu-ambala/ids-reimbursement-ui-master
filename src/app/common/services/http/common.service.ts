import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private baseUrl = environment.serviceUrl;

  constructor(private http: HttpClient, private httpService: HttpService) { }

  //all icd codes
  getICDList(): Observable<any> {
    return this.http.get(this.baseUrl + '/icd/getAll')
    // return this.http.get(this.baseUrl + '/icd/getAllICDLimitColumns')
    .pipe(map((resp: any) => {
        return resp.map(o=>{return {icdValue: o.icdCode + '-' + o.description , icdId: o.icdId, icdCode:o.icdCode}});
    }));
  }

  //all drug codes
  getdrugList(): Observable<any> {
    return this.http.get(this.baseUrl + '/drug/getAll');
  }

  getIcdDetails(term: string = null): Observable<any> {
    return this.httpService
      .getAll('icd/getByIcdCodeContainingIgnoreCase?icdCode=' + term)
      .pipe(map(resp => {
        if (resp.Error) {
          this.handleError(resp.Error);
        } else {
          return resp.map(o=>{return {icdValue: o.icdCode + '-' + o.description , icdId: o.icdId, icdCode:o.icdCode}});
        }
      }));
  }

  getExactIcd(code: string): Observable<any> {
    return this.http.get(this.baseUrl + '/icd/getByIcdCode?icdCode=' + code);
  }

  getWbsList(facilityId): Observable<any> {
    return this.http.get(this.baseUrl + '/wbs/getWbsByFacilityId/' + facilityId);
  }

  getWbsByLogin(params: any): Observable<any> {
    return this.http.get(this.baseUrl + '/user/getWbsByUserIdAndFacilityId?userId=' + params.userId + '&' +'facilityId=' + params.facilityId  );
  }

 getDrugDetails(term: string = null): Observable<any> {
    return this.httpService
    .getAll('drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam=' + term + "&pagination=false")
      .pipe(map(resp => {
        if (resp.Error) {
          this.handleError(resp.Error);
        } else {
          return resp.content.map(o=>{return {drugValue: o.drugProcCode + '-' + o.longDesc , drugId: o.drugId}});
        }
      }));
  }

  getTeamMemberList(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl+ '/user/getTeamMemberList?userId=' + params.userId).pipe(
    catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let message="Something went wrong,Please check!";
       if(!!error?.error?.message){
         message = error.error.message;
     }
     return throwError(message);
   }
 }
