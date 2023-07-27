import { ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LoginService } from 'src/app/common/services/login/login.service';

import { LoginContentComponent } from './login-content.component';
import { LoginHelpComponent } from './login-help/login-help.component';
import { LoginComponent } from './login/login.component';


describe('LoginContentComponent', () => {
  let component: LoginContentComponent;
  let fixture: ComponentFixture<LoginContentComponent>;
  const toggleLoginSub = new Subject<any>();
  const loginService = jasmine.createSpyObj('LoginService', [
    'toggle'
  ], {
    toggleLogin$: toggleLoginSub
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginContentComponent, LoginComponent, LoginHelpComponent ],
      providers: [
        { provide: LoginService, useValue: loginService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login', done => {
    spyOn<LoginContentComponent, any>(component, 'resolveComp').and.callFake(() => {});
    toggleLoginSub.subscribe(mode => {
      expect(component).toBeTruthy();
      done();
    });

    toggleLoginSub.next('login');
  });

  it('should create login-help', done => {
    spyOn<LoginContentComponent, any>(component, 'resolveComp').and.callFake(() => {});
    toggleLoginSub.subscribe(mode => {
      expect(component).toBeTruthy();
      done();
    });

    toggleLoginSub.next('help');
  });
});
