import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { LoginService } from './login.service';

describe('LoginService', () => {
    let loginService: LoginService;
    let httpTestingController: HttpTestingController;

    const baseUrl = environment.serviceUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LoginService]
        });
        loginService = TestBed.inject(LoginService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(()=>{
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(loginService).toBeTruthy();
    });

    it(' resetPassword set password okta', async(() => {
        let data = 'test';
        loginService.resetPassword(data).subscribe((res) => {
            expect(res).not.toBeNull();
        });
        const req = httpTestingController.expectOne(baseUrl + '/okta/user/resetPassword');
        expect(req.cancelled).toBeFalsy();
        expect(req.request.method).toEqual('POST');
        req.flush({})
    }));

    it('setPassword set password okta', async(() => {
        let data = 'test';
        loginService.setPassword(data).subscribe((res) => {
            expect(res).not.toBeNull();
        });
        const req = httpTestingController.expectOne(baseUrl + '/okta/user/setPassword');
        expect(req.cancelled).toBeFalsy();
        expect(req.request.method).toEqual('POST');
        req.flush({})
    }));

    it('getSecurityQuestions get security questions', async(() => {
        let code = 'test';
        loginService.getSecurityQuestions(code).subscribe((res) => {
            expect(res).not.toBeNull();
        });
        const req = httpTestingController.expectOne(baseUrl + `/okta/user/securityQuestions/${code}`);
        expect(req.cancelled).toBeFalsy();
        expect(req.request.method).toEqual('GET');
        req.flush({})
    }));

    it('submitSecurityAnswer post answers', async(() => {
        let userName = 'testUser';
        let data = 'test';
        loginService.submitSecurityAnswer(userName, data).subscribe((res) => {
            expect(res).not.toBeNull();
        });
        const req = httpTestingController.expectOne(baseUrl + `/okta/user/factor/question/save/${userName}`);
        expect(req.cancelled).toBeFalsy();
        expect(req.request.method).toEqual('POST');
        req.flush({})
    }));

    it('toggle is called', () => {
        let mode: 'test';
        loginService.toggle(mode);
        expect(loginService.toggle).toBeTruthy();
    })
});