import {AuthGuard} from './auth.guard';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}
describe('AuthGuard', () => {

  const dummyRoute = {} as ActivatedRouteSnapshot;
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let serviceStub: Partial<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  describe('AuthGuard (Isolated)', () => {
    it('when the user is authenticated return true', async () => {
      serviceStub = {
        isAuthenticated(): Promise<boolean> {
          return Promise.resolve(true);
        }
      };
      guard = new AuthGuard(serviceStub as AuthService, routerSpy);
      const canActivate = guard.canActivate(dummyRoute, fakeRouterState('/dashboard')) as Promise<boolean>;
      expect(await canActivate).toBeTrue();
    });
    it('when the user is not authenticated navigate to login', async () => {
      serviceStub = {
        isAuthenticated(): Promise<boolean> {
          return Promise.resolve(false);
        }
      };
      guard = new AuthGuard(serviceStub as AuthService, routerSpy);
      const canActivate = guard.canActivate(dummyRoute, fakeRouterState('/dashboard')) as Promise<boolean>;
      expect(await canActivate).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/login']);
    });
  });
});
