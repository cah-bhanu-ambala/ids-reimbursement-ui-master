import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/common/services/http/authentication.service';
import { Menu } from 'src/app/models/classes/menu';
import { User } from 'src/app/models/classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  faUser = faUser;
  faLock = faLock;
  userName: string;
  passWord: string;
  submitted: boolean;
  isLoginSuccess: boolean;
  showError: boolean;
  menuList: any;
  users: any;
  currentUser: User;
  menusByRole: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService,
    private router: Router
  ) {


  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  get f() { return this.loginForm != null ? this.loginForm.controls : null }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required]]

    });
  }


  onSubmit() {
    this.submitted = true;
    //Check form is valid or not
    if (this.loginForm.invalid) {
      return false;
    }
    else
      this.onLogin();
  }

  //This is only temporary implmentaion and needs to be removed and used single sign on
  onLogin() {
    if (!!this.loginForm.get('userEmail').value)
    {
      this.authService.getUserDetails(this.loginForm.get('userEmail').value).subscribe(data => {

        this.currentUser = data;
        if (!!this.currentUser)
        {
          this.isLoginSuccess = true;
          this.showError = false;
          localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
          this.router.navigate(['/dashboard/']);
        }
        else
        {
          this.showError = true;
          this.isLoginSuccess = false;
        }
      },(error)=> {
        this.showError = true;
        this.isLoginSuccess = false;
      })
    }
    else {
      this.showError = true;
      this.isLoginSuccess = false;
    }

  }

  //onLogin(){
  // this.authService.login(this.loginForm.value);
  // }
}
