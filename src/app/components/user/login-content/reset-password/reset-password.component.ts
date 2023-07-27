import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { LoginService } from 'src/app/common/services/login/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  password1 = false;
  password2 = false;
  formSubmitted = false;
  private patternRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    if (!this.loginService.setPassData){
      this.router.navigate(['/']);
    }
    this.resetPasswordForm = this.fb.group({
      enterPassword: ['', [Validators.required, Validators.pattern(this.patternRegEx)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submitNewPassword() {
    this.formSubmitted = true;
    if (this.loginService.securityAnswer) {
      const data = {credentials: {  username: this.loginService.setPassData.profile.email,
        password: this.resetPasswordForm.controls.enterPassword.value,
        question: this.loginService.securityAnswer.question,
        answer: this.loginService.securityAnswer.answer
      }};
      this.loginService.resetPassword(data).subscribe((response: any) => {
        this.loginService.setPassData = undefined;
        this.loginService.securityAnswer = undefined;
        this.router.navigate(['/user/login']);
      }, error => {
        console.error(error);
      });
    } else {
      const data = {credentials: {email: this.loginService.setPassData.profile.email,
          password: this.resetPasswordForm.controls.enterPassword.value}};
      this.loginService.setPassword(data).subscribe((response: any) => {
        this.loginService.setPassData = undefined;
        this.loginService.securityAnswer = undefined;
        this.router.navigate(['/user/login']);
      }, error => {
        console.error(error);
      });
    }
  }

  get f() { return this.resetPasswordForm.controls; }

}
