import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmLeaveModalComponent } from './components/shared/confirm-leave-modal/confirm-leave-modal.component';
import { DirtyCheckGuard } from './common/guards/dirty/dirty.guard';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { UserIdleModule } from 'angular-user-idle';
import { NgbDateCustomParserFormatter } from './models/classes/ngbDateCustomParserFormatter';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmLeaveModalComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    OktaAuthModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
     ModalModule.forRoot(),
     UserIdleModule.forRoot({
       idle: 3600
     })
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: OKTA_CONFIG, useValue: environment.oidc },
  { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  BsModalService,
  DirtyCheckGuard,
  CookieService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
