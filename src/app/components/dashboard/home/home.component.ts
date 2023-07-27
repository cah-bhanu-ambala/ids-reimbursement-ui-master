import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/common/services/http/authentication.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { Menu } from 'src/app/models/classes/menu';
import { User } from 'src/app/models/classes/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent implements OnInit {
  isOpen: boolean;
  public isMenuCollapsed = true;
  isAdmin: boolean;
  isSupport: boolean;
  isWork: boolean;
  isAdvocacy: boolean;
  isReports: boolean;
  isCustomerWork: boolean;
  isCustomerReports: boolean;
  currentUser: User;
  menusByRole: any;
  menuList: any;
  users: any;
  expanded: boolean = false;
  selectedMainMenu: string = '';
  facilities: any;
  currentUserRole: string = '';

  constructor(
    private router: Router,
    private patientService: PatientService,
    private authService: AuthenticationService
  ) {

    interval(3600000)
      .pipe(
        mergeMap(() =>
          this.authService.getUserDetails(this.currentUser.userEmail)
        )
      )
      .subscribe(data => {
        this.currentUser = data;
        if (!!this.currentUser) {
          localStorage.setItem("currentUser", "");
          localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        }
      })
  }

  ngOnInit() {
    this.getFacilityList();
  }

  getFacilityList() {
    this.patientService.getFacilityList().subscribe(
      (result) => {
        this.facilities = result;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        localStorage.setItem("userId", this.currentUser.userId.toString());
        localStorage.setItem("userName", this.currentUser.userName.toString());
        localStorage.setItem("currentUserRole", this.currentUser.userRole.userRoleName);
        this.menusByRole = this.currentUser != null ? this.currentUser.userRole.roleMenus : new Menu;
        localStorage.setItem("systemId", this.currentUser.systemId);
        //This can be removed once we have all changes in all pages under external user view
        this.setFacilityLocalStorageInfo();

      }
    );
  }

  SelectMenu(menu) {
    this.selectedMainMenu = menu.mainMenu;
  }

  onLogout() {
    this.router.navigate(['/register/login/'])
  }

  setFacilityLocalStorageInfo() {
    let facilityListForSys= [];
    if (parseInt(this.currentUser.systemId) > 0){
      facilityListForSys = this.facilities.filter(x => x.systemId == this.currentUser.systemId)
    }
    localStorage.setItem("CustomerfacilityId", facilityListForSys.length > 0 ? facilityListForSys[0].facilityId: '0');
    localStorage.setItem("CustomerfacilityName", facilityListForSys.length > 0 ? facilityListForSys[0].facilityName : '');
  }
}
