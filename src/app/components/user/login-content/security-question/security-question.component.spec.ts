import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/common/services/login/login.service';

import { SecurityQuestionComponent } from './security-question.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';

describe('SecurityQuestionComponent', () => {
  let component: SecurityQuestionComponent;
  let fixture: ComponentFixture<SecurityQuestionComponent>;
  let router: Router;
  const service = jasmine.createSpyObj('LoginService', ['getSecurityQuestions', 'submitSecurityAnswer']);

  const activatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return '123';
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ SecurityQuestionComponent ],
      providers: [{ provide: LoginService, useValue: service},
        {provide: ActivatedRoute, useValue: activatedRoute}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service.getSecurityQuestions.and.returnValue(of({
      oktaSecurityQuestions: [{question: 'test', answer: 'test'}],
    }));
    fixture = TestBed.createComponent(SecurityQuestionComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to set', () => {
    component.securityQuestionForm.patchValue({question: 'test', answer: 'test'});
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.questions = [{question: 'test', answer: 'test'}];
    component.currentUser = {stateToken: 'test', profile: { login: 'test'}};
    component.submitSecurityAnswer();
    expect(component).toBeTruthy();

  });

  it('should redirect to submitSecurityAnswer', () => {
    service.submitSecurityAnswer.and.returnValue(of({}));
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.securityQuestionForm.patchValue({question: 'test', answer: 'test'});
    component.questions = [{question: 'test', answer: 'test'}, {question: 'test', answer: 'test'}];
    component.currentUser = {stateToken: 'test', profile: { login: 'test'}};
    component.submitSecurityAnswer();
    expect(service.submitSecurityAnswer).toHaveBeenCalled();
  });

  it('should redirect to submitSecurityAnswer throw error', () => {
    service.submitSecurityAnswer.and.returnValue(throwError({}));
    component.questions = [{question: 'test', answer: 'test'       }, {question: 'test', answer: 'test'}];
    component.currentUser = {stateToken: 'test', profile: { login: 'test'}};
    component.submitSecurityAnswer();
    expect(service.submitSecurityAnswer).toHaveBeenCalled();
  });

  describe('SecurityQuestionComponent_1', () => {

    beforeEach(() => {
      service.getSecurityQuestions.and.returnValue(throwError({}));
      fixture = TestBed.createComponent(SecurityQuestionComponent);
      router = TestBed.inject(Router);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
