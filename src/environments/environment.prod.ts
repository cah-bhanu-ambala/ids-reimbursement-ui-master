import { BrowserHelper } from 'src/app/models/classes/browser-helper';
const env_config = (window as any)?.config;
export const environment = {
  production: true,
  serviceUrl: env_config?.API_ENDPOINT || 'https://api.dev.cardinalhealth.com/reimb/api/v1',
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
