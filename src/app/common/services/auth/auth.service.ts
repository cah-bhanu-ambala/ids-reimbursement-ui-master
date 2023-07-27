import {Injectable, Optional} from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';
import {User} from 'src/app/models/classes/user';
import {OKTA_TOKEN, RCM_TOKEN, TOKEN_EXPIRED} from './auth.constants';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HttpService} from 'src/app/common/services/http/http.service';
import {AuthTransaction, OktaAuth} from '@okta/okta-auth-js';
import {environment} from 'src/environments/environment';
import {ApigeeService} from '../apigee/apigee.service';
import {ApigeeToken} from 'src/app/models/interfaces/apigee-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {

  private timer: any;

  constructor(private oktaAuthService: OktaAuthService,
      protected httpClient: HttpClient,
      private apigeeService: ApigeeService,
      @Optional() private authClient: OktaAuth) {
    super(httpClient);

  }

  isAuthenticated(): Promise<boolean> {
    return this.oktaAuthService.isAuthenticated();
  }

  async setUser(): Promise<any> {
    const userClaims = await this.oktaAuthService.getUser();

    const user = new User({
      firstName: userClaims.given_name,
      lastName: userClaims.family_name,
      username: userClaims.preferred_username,
      userEmail: userClaims.email
    });

    sessionStorage.setItem(RCM_TOKEN, JSON.stringify(user));

    return userClaims;
  }

  getStoredUser(): User {
    const sessionUser = sessionStorage.getItem(RCM_TOKEN);

    if (sessionUser == null) {
      return null;
    }

    return JSON.parse(sessionUser);
  }

  async getUserAsync(): Promise<User> {
    let sessionUser = sessionStorage.getItem(RCM_TOKEN);

    if (sessionUser == null) {
      await this.setUser();
      sessionUser = sessionStorage.getItem(RCM_TOKEN);
    }

    return JSON.parse(sessionUser);
  }

  getAccessToken(): string {
    return this.oktaAuthService.getAccessToken();
  }

  getIdToken(): string {
    return this.oktaAuthService.getIdToken();
  }

  setTokenExpired(): void {
    sessionStorage.setItem(TOKEN_EXPIRED, "true");
    this.logout();
  };

  hasTokenExpired(): boolean {
    const tokenExpired = sessionStorage.getItem(TOKEN_EXPIRED);
    return tokenExpired && tokenExpired === 'true';

  }

  getAuthClient(): any {
    if (!this.authClient) {
      this.authClient = new OktaAuth(environment.oidc);
      this.authClient.tokenManager.on('renewed', this.rotateApigeeToken.bind(this));
    }
    return this.authClient;
  }

  rotateApigeeToken(key): void {
    const authClient = this.getAuthClient();
    authClient.tokenManager.getTokens().then(({ accessToken, idToken }) => {
      if(key === 'accessToken') {
        this.apigeeService.generateApigeeToken(accessToken.accessToken, idToken.idToken)
        .then((apigeeResponse: ApigeeToken) => {
          this.apigeeService.setApigeeToken(apigeeResponse);
        });
      }
    });
  };

  async logout(): Promise<void> {
    const authClient = this.getAuthClient();
    authClient.tokenManager.getTokens().then(({ accessToken, idToken }) => {
      authClient.signOut({
        idToken,
        accessToken
      });
    });
    clearInterval(this.timer);
    sessionStorage.removeItem(OKTA_TOKEN);
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem(RCM_TOKEN);
  }

  clearTokenExpiration(): void {
    sessionStorage.removeItem(TOKEN_EXPIRED);
  }


  requestPassReset(email: string): Observable<any> {
    return this.get<any>(`/okta/user/${email}/resetPasswordEmail`);
  }

  /**
   * Rotate okta token every 59 mins(Before it actually expire).
   * Token renewed event will rotate apigee on successful okta token rotation.
   * @param interval
   */
   rotateOktaToken(interval: number): void {
    this.timer = setInterval(async () => {
      let authClient = this.getAuthClient();
      authClient.tokenManager.renew('idToken');
      authClient.tokenManager.renew('accessToken');
      }, interval);
  }

  async login(username: string, password: string): Promise<any> {
      const authClient = this.getAuthClient();
      return new Promise((resolve, reject) => {
        authClient.signInWithCredentials({ username, password }).then((transaction: AuthTransaction) => {
          if (transaction.status === 'SUCCESS') {
            if (this.oktaAuthService.getAccessToken()) {
              this.rotateOktaToken(3540000);
              resolve({ result: 'success' });
            } else {
              authClient.token.getWithoutPrompt({
                sessionToken: transaction.sessionToken
              }).then((response) => {
                authClient.tokenManager.setTokens(response.tokens);
                this.apigeeService.generateApigeeToken(response.tokens.accessToken.accessToken, response.tokens.idToken.idToken)
                  .then((apigeeResponse: ApigeeToken) => {
                    this.apigeeService.setApigeeToken(apigeeResponse);
                    const user = new User({
                      given_name: transaction.user.profile.firstName,
                      family_name: transaction.user.profile.lastName,
                      preferred_username: transaction.user.profile.login,
                      id: transaction.user.id
                    });
                    sessionStorage.setItem(RCM_TOKEN, JSON.stringify(user));
                    this.rotateOktaToken(3540000);
                    resolve({ result: 'success' });
                  }).catch(error => {
                  reject({ errorMessage: 'Invalid token, Please login again.' });
                });
              });
            }
          } else if (transaction.status === 'LOCKED_OUT') {
            reject({ errorMessage: 'Your account is locked, Please contact your adminstrator.' });
          }
        }).catch(error => {
          reject({ errorMessage: 'The username and password do not match.' });
        });
      });
    }

}
