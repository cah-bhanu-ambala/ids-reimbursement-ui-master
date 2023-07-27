import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { LoginService } from 'src/app/common/services/login/login.service';


@Component({
  selector: 'app-login-help',
  templateUrl: './login-help.component.html',
  styleUrls: ['./login-help.component.scss']
})
export class LoginHelpComponent implements OnInit {

  loginHelpForm: FormGroup;

  submitted = false;
  success = false;
  message = '';

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.loginHelpForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]+@[a-zA-Z.-]{2,}\.[a-zA-Z]{2,}')]]
    });
  }

  get f() { return this.loginHelpForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.loginHelpForm.invalid) {
      if (this.f.email.errors && this.f.email.errors.required) {
        this.message = 'Email Required';
      } else if (this.f.email.errors && this.f.email.errors.pattern) {
        this.message = 'Invalid Email';
      }

      return;
    }

    this.authService.requestPassReset(this.loginHelpForm.value.email).subscribe(
      res => {
        this.success = true;
        this.message = 'Thank you,<br>An email has been sent to reset your password.<br><strong>You can click "Close" to return to the Sign In page.</strong>';
      }, err => {
        this.message = err.errorMessage;
      });
  }

  onCancelClose(): void {
    this.loginService.toggle('login');
  }

}
