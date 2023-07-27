// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// tslint:disable-next-line:variable-name
import { BrowserHelper } from 'src/app/models/classes/browser-helper';
const env_config = (window as any)?.config;
export const environment = {
  production: false,
  serviceUrl: env_config?.API_ENDPOINT || 'http://localhost:8080/api/v1',
  clientId: env_config?.CLIENT_ID || '0oa124ic0v9yM9z3p0h8',
  oktaDomain: `https://${env_config?.OKTA_DOMAIN || 'myidb2bdev.cardinalhealth.com'}`,
  tunOffOktaLogout: env_config?.tunOffOktaLogout || false,
  oidc: {
    clientId: env_config?.CLIENT_ID || '0oa124ic0v9yM9z3p0h8',
    issuer: `https://${env_config?.OKTA_DOMAIN || 'myidb2bdev.cardinalhealth.com'}`,
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: !BrowserHelper.isIE11(),
    responseType: 'code',
    tokenManager: {
      storage: 'sessionStorage',
      autoRenew : true
    }
  },
  resourceServer: {
    oauthUrl: env_config?.OAUTH_URL || 'https://api.dev.cardinalhealth.com/oauth2/v2/token/jwtforoktab2b',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
