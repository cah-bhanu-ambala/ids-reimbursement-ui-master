import { AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/common/services/login/login.service';
import { CompContent } from 'src/app/models/classes/comp-content';
import { LoginHelpComponent } from './login-help/login-help.component';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-login-content',
  templateUrl: './login-content.component.html',
  styleUrls: ['./login-content.component.scss']
})
export class LoginContentComponent extends CompContent implements AfterViewInit, OnDestroy, OnInit {

  private modeSubs = new Subscription();

  @ViewChild('loginContent', { read: ViewContainerRef }) loginContent: ViewContainerRef;

  constructor(
    private loginService: LoginService,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(componentFactoryResolver);
  }

  ngOnInit(): void {
    this.modeSubscription();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initLoginContent();
    });
  }

  ngOnDestroy(): void {
    this.modeSubs.unsubscribe();
  }

  private initLoginContent(): void {
    this.resolveComp(LoginComponent, this.loginContent);
  }

  private modeSubscription(): void {
    this.modeSubs = this.loginService.toggleLogin$.subscribe(mode => {
      if (mode === 'login') {
        this.resolveComp(LoginComponent, this.loginContent);
      } else {
        this.resolveComp(LoginHelpComponent, this.loginContent);
      }
    });
  }

}
