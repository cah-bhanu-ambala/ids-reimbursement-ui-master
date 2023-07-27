import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/common/services/login/login.service';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit {

  private code: string;

  securityQuestionForm: FormGroup;
  currentUser: any;
  questions: any = [];
  questionsLength = 0;
  responseType: any;
  apiResponse: any;
  resetQuestionText: string;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.code = this.route.snapshot.paramMap.get('code');

    if (!this.code) {
      this.router.navigate(['/']);
    }

    this.securityQuestionForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
    this.loginService.getSecurityQuestions(this.code).subscribe((response: any) => {
      this.currentUser = response;
      this.questions = response.oktaSecurityQuestions;
      this.questionsLength = this.questions.length;
      if (this.questionsLength === 1) {
        this.resetQuestionText = this.questions[0].questionText;
        this.securityQuestionForm.patchValue({question: this.questions[0].question});
      }
      this.responseType = typeof (this.questions);
    }, error => {
      console.error(error);
    });
  }

  submitSecurityAnswer() {
    const question = this.questions.length > 1 ? this.securityQuestionForm.controls.question.value : this.questions[0].question;
    const data = {  question,
                  answer: this.securityQuestionForm.controls.answer.value,
                  stateToken: this.currentUser.stateToken };
    if (this.questions.length === 1) {
      this.currentUser.profile.email = this.currentUser.profile.login;
      this.loginService.setPassData = this.currentUser;
      this.loginService.securityAnswer = data;
      this.router.navigate(['/user/password/set']);
    } else {
      this.loginService.submitSecurityAnswer(this.currentUser.profile.login, data).subscribe((response: any) => {
            this.loginService.setPassData = response;
            this.router.navigate(['/user/password/set']);
      }, error => {
        console.error(error);
      });
    }
  }

}
