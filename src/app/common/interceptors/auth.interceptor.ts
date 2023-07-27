import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {SpinnerService} from 'src/app/common/services/spinner/spinner.service';


import {from, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApigeeService} from '../services/apigee/apigee.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private spinnerService: SpinnerService,
              private apigeeService: ApigeeService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const url = environment.resourceServer.oauthUrl;
    if (!request.url.includes(url)) {
      const apigeeToken = this.apigeeService.getApigeeToken();
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + apigeeToken
        }
      });
    }
    this.totalRequests++;
    this.spinnerService.setSpinner(true);
    return next.handle(request).toPromise().finally(() => {
      this.totalRequests--;
      if (this.totalRequests === 0) {
        this.spinnerService.setSpinner(false);
      }
    });
  }
}
