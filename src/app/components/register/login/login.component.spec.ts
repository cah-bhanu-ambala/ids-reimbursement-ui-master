import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthenticationService } from 'src/app/common/services/http/authentication.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>; 
  let service: AuthenticationService;
  let router: Router;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule,BrowserAnimationsModule 
      ],
      providers: [AuthenticationService, ToastrService,     {
            provide: Router,
            useClass: class {
              navigate = jasmine.createSpy("navigate");
            }
          },
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuthenticationService);
    router = fixture.debugElement.injector.get(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {   
    expect(component).toBeTruthy();
  });

  it('[getUserDetails] should login on login button click', async(() => {
    let userEmail = component.loginForm.controls['userEmail'];
    userEmail.setValue('admin@infodatinc.com');
    spyOn(service, 'getUserDetails').and.returnValue(of({}));  
    component.onLogin();
    expect(component.currentUser).toBeTruthy()
    expect(service.getUserDetails).toHaveBeenCalled(); 
  })); 

  it('[onSubmit] should login into application', async(() => { 
    const userFormValues ={ 
        userEmail: 'admin@infodatinc.com'
    }

    let login = component.loginForm.controls['userEmail'];
    login.setValue(userFormValues);
    expect(login.valid).toBeTrue();

    //component.loginForm.patchValue(userFormValues);
    component.submitted=true;  

    const spy = spyOn(service, 'getUserDetails').and.returnValue(of({}));  
    component.onSubmit();  
    expect(component.f).toBeTruthy();
    expect(spy).toHaveBeenCalled();  
  }));

  it('[login Form check]-should check login form value is valid or not', () => {
    let login = component.loginForm.controls['userEmail'];
    expect(login.valid).toBeFalsy();
    expect(login.pristine).toBeTruthy();
    expect(login.errors['required']).toBeTruthy();
  });

  it('[getUserDetails] click login throws error', async(() => {
    let err="error";
    const userFormValues ={ 
        userEmail: 'admin@infodatinc.com'
    }
    component.loginForm.patchValue(userFormValues);
    const spy = spyOn(service, 'getUserDetails').and.returnValue(throwError(err)); 
    component.onLogin(); 
    expect(component.showError).toBeTrue();
    expect(component.isLoginSuccess ).toBeFalse();
    expect(spy).toHaveBeenCalled();  
  }));
});

