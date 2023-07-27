import { async, ComponentFixture, TestBed  } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { OktaAuthService, OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let localStore;
  let authService :AuthService
  let router: Router;
   const oktaConfig = {
      issuer: 'https://not-real.okta.com',
      clientId: 'fake-client-id',
      redirectUri: 'http://localhost:4200'
    };
  beforeEach(async(()  => {
    TestBed.configureTestingModule({imports:[OktaAuthModule, HttpClientModule, RouterTestingModule ],
      declarations: [HeaderComponent],
      providers:[AuthService,OktaAuthService,{provide: OKTA_CONFIG, useValue: oktaConfig}]
    }).compileComponents();
  }));

 beforeEach(() => {
   localStore = {};
     let store = {};
   const mockLocalStorage = {
       getItem: (key: string): any => {
         return key in store ? store[key] : null;
       },
       setItem: (key: string, value: any) => {
         store[key] = `${value}`;
       },
       removeItem: (key: string) => {
         delete store[key];
       },
       clear: () => {
         store = {};
       }
     };
     spyOn(localStorage, 'getItem')
       .and.callFake(mockLocalStorage.getItem);
     spyOn(localStorage, 'setItem')
       .and.callFake(mockLocalStorage.setItem);
   localStorage.setItem('currentUser', JSON.stringify({'userName':'user','userRole':{'userRoleName':'role'}}));
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();

  });

  it('initializes', () => {
    expect(component).toBeTruthy();
  });

    it('onUser_false', () => {
      component.showMenu = true
      component.onUser()
      expect(component.showMenu).toBeFalsy();
    });

    it('onUser_true', () => {
      component.showMenu = false
      component.onUser()
      expect(component.showMenu).toBeTruthy();
    });

    it('logout_turnOffOkta', () => {
     environment.tunOffOktaLogout = true
     component.onLogout()
     expect(component).toBeTruthy();
    });

     it('logout_turnOnOkta', () => {
      environment.tunOffOktaLogout = false
      const spy = spyOn(authService, 'logout').and.returnValue(Promise.resolve());
      component.onLogout()
      expect(component).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });


});
