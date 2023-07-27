import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserIdleService } from 'angular-user-idle';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/common/services/http/user.service';
import { User } from 'src/app/models/classes/user';
import { LoginService } from 'src/app/common/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  submitted = false;
  success = false;
  processing = false;
  message = '';
  currentUser: User;

  constructor(
    private cookieService: CookieService,
    private loginService: LoginService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private userIdleService: UserIdleService
  ) { }

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    this.buildForm();
    this.checkAuthentication();
    this.checkRememberMe();

    this.userIdleService.onTimerStart().subscribe(count => {
      this.authService.setTokenExpired();
    });
    if (this.authService.hasTokenExpired()) {
      this.authService.clearTokenExpiration();
      this.message = 'Due to inactivity, you have been logged out.';
    }
  }

  login(): void {
    this.submitted = true;
    this.processing = true;
    this.message = '';

    if (this.loginForm.invalid) {
      return this.validateLogin();
    }

    const value = this.loginForm.value;

    this.authService.login(value.username, value.password).then(res => {
      this.setRememberMe(value);
      this.authService.setUser().then(() => {
        this.routeUser();
      });
    }).catch(err => {
      this.message = err.errorMessage;
    });
  }

  loginHelp(): void {
    this.loginService.toggle('help');
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]+@[a-zA-Z.-]{2,}\.[a-zA-Z]{2,}')]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  private checkRememberMe(): void {
    const hasCookieSet = this.cookieService.check('remember');
    const rememberMe = this.cookieService.get('remember') === 'yes';
    if (hasCookieSet && rememberMe) {
      this.loginForm.patchValue({
        username: this.cookieService.get('username'),
        rememberMe: true
      });
    }
  }
  private routeUser(): void {
    this.userService.getUserDetails(this.authService.getStoredUser().userEmail).subscribe(data => {
      this.currentUser = data;
      if (!!this.currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
        this.userIdleService.startWatching();
        this.router.navigate(['/dashboard/']);
      }
    });
  }

  private checkAuthentication(): void {
    const isOktaAuthenticated = this.authService.isAuthenticated();

    if (isOktaAuthenticated) {
      this.authService.setUser().then(user => {
       this.routeUser()
      });
    }
  }

  private setRememberMe({ rememberMe, username }): void {
    const expires = Date.now() + 2629800000; // month from login
    const options = { expires: new Date(expires), path: '/', secure: true };

    if (rememberMe) {
      this.cookieService.set('remember', 'yes', options);
      this.cookieService.set('username', username, options);
    } else {
      this.cookieService.set('remember', 'no', options);
      this.cookieService.set('username', '', options);
    }
  }

  private validateLogin(): void {
    if (this.f.username.errors && this.f.username.errors.required) {
      this.message = 'Username required';
    } else if (this.f.username.errors && this.f.username.errors.pattern) {
      this.message = 'Invalid username';
    }

    if (this.f.password.errors && this.f.password.errors.required) {
      this.message += `${this.message.length > 0 ? ', ' : ''}Password required`;
    }
    this.processing = false;

    return;
  }
}
