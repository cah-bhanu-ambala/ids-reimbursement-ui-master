import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TOKEN_NAME } from './apigee.constants';
import { ApigeeToken } from '../../../models/interfaces/apigee-token';

@Injectable({
  providedIn: 'root'
})
export class ApigeeService {

  private baseUrl: string;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  async generateApigeeToken(oktaAccessToken: string, oktaIdToken: string): Promise<object> {
    sessionStorage.removeItem(TOKEN_NAME);

    this.baseUrl = environment.resourceServer.oauthUrl;

    const headers = {
      Authorization: `Bearer ${oktaIdToken}, Bearer ${oktaAccessToken}`
    };
    const body = {};

    return await this.httpClient.post(this.baseUrl, body, { headers }).toPromise();
  }

  setApigeeToken(token: ApigeeToken): void {
    sessionStorage.removeItem(TOKEN_NAME);
    sessionStorage.setItem(TOKEN_NAME, token.access_token);
  }

  getApigeeToken(): string {
    return sessionStorage.getItem(TOKEN_NAME);
  }
}
