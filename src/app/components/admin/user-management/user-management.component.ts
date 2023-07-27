import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/classes/user';
import { UserService } from 'src/app/common/services/http/user.service';
import { ToastrService } from 'ngx-toastr';
import { emailValidator } from 'src/app/common/utils';
import { LazyLoadEvent } from 'primeng/api';
import { CommonService } from 'src/app/common/services/http/common.service';
import { SystemService } from 'src/app/common/services/http/system.service';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
    formUserMgntUserMgt: FormGroup;
    userSearchForm: FormGroup;
    submitted: boolean;
    userRoleList: any[];
    userList: any[] = [];
    userReportingUserList: any[];
    reportingTo: string;
    showReportingTo: boolean;
    userSearchParam: string;
    searchResult: any[];
    showGrid: boolean;
    isUpdate: boolean;
    userIdMgnt: number;
    errorMessage: any = '';
    showSystems: boolean = false;
    systems: any[];
    selectedSystemId: any;
    loggedInUser: any;
    selectedRoleId: any;
    showError: boolean;
    showForm: boolean = true;

    userGridloading: boolean;
    userDatasource: any;
    userSearchResult: any;
    userTotalRecords: any;
    isDirtyUserMgnt = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private systemService: SystemService,
        private commonService: CommonService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.isUpdate = false;
        this.submitted = false;
        this.buildFormControls();
        this.getUserList();
        this.getUserRole();
        this.getSystemList();
        this.buildUserSearchForm();
        this.userSearchParam = '';
        this.loggedInUser = localStorage.getItem("userId");
        this.onSearch('');
        this.formUserMgntUserMgt.valueChanges.subscribe( e => this.isDirtyUserMgnt = true );
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    buildFormControls() {
        this.formUserMgntUserMgt = new FormGroup({
            userName: new FormControl({value: '', disabled: true}, [Validators.required]),
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            userEmail: new FormControl('', [Validators.pattern(emailValidator), Validators.required]),
            userRoleId: new FormControl('', [Validators.required])
        });

        this.userEmail.valueChanges.subscribe(email => {
          this.formUserMgntUserMgt.patchValue({
            userName: email
          });
        });

        this.userRoleId.valueChanges.subscribe((roleid) => {
            if (roleid != null && roleid != "") {
                var user = this.userRoleList.filter(x => x.userRoleId == roleid)[0];
                switch (user.userRoleName) {
                    case 'External User':
                        this.showSystems = true;
                        this.formUserMgntUserMgt.addControl('systemId', new FormControl('', [Validators.required]));
                        if (this.formUserMgntUserMgt.get("teamLeadId") != null) {
                            this.formUserMgntUserMgt.removeControl("teamLeadId");
                        }
                        this.showReportingTo = false;
                        break;
                    case 'Team Lead':
                        this.getReportingUserList("getSuperUserRoleUsers");
                        this.formUserMgntUserMgt.addControl('teamLeadId', new FormControl('', [Validators.required]));
                        if (this.formUserMgntUserMgt.get("systemId") != null) {
                            this.formUserMgntUserMgt.removeControl("systemId");
                        }
                        this.showReportingTo = true;
                        this.showSystems = false;
                        break;
                    case 'Business Analyst':
                        this.getReportingUserList("getTeamleadRoleUsers");
                        this.formUserMgntUserMgt.addControl('teamLeadId', new FormControl('', [Validators.required]));
                        if (this.formUserMgntUserMgt.get("systemId") != null) {
                            this.formUserMgntUserMgt.removeControl("systemId");
                        }
                        this.showSystems = false;
                        this.showReportingTo = true;
                        break;
                    default:
                        if (this.formUserMgntUserMgt.get("systemId") != null) {
                            this.formUserMgntUserMgt.removeControl("systemId");
                        }
                        if (this.formUserMgntUserMgt.get("teamLeadId") != null) {
                            this.formUserMgntUserMgt.removeControl("teamLeadId");
                        }
                        this.showReportingTo = false;
                        this.showSystems = false;
                        break;
                }
            } else {
                if (this.formUserMgntUserMgt.get("systemId") != null) {
                    this.formUserMgntUserMgt.removeControl("systemId");
                }
                if (this.formUserMgntUserMgt.get("teamLeadId") != null) this.formUserMgntUserMgt.removeControl("teamLeadId");
                this.showReportingTo = false;
                this.showSystems = false;
            }
        });
    }


    get f() { return this.formUserMgntUserMgt != null ? this.formUserMgntUserMgt.controls : null; }

    get userRoleId() {
        return this.formUserMgntUserMgt.get('userRoleId') as FormControl;
    }

    get userEmail() {
      return this.formUserMgntUserMgt.get('userEmail') as FormControl;
    }

    get systemId() {
        return this.formUserMgntUserMgt.get('systemId') as FormControl;
    }

    teamLeadValidator(control: FormControl) {
        /*if(control.root.value.userRoleId == 3) {

            return Validators.required(control.value.teamLeadId);
        }*/
    }


    buildUserSearchForm() {
        this.userSearchForm = this.formBuilder.group({
            userIdMgnt: ['']
        });
    }

    getUserRole() {
        this.userService.getUserRole().subscribe(
            (result) => {
                this.userRoleList = result;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getSystemList() {
        this.systemService.getApprovedSystems().subscribe(
            (result) => {
                this.systems = result;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getUserList() {
        this.userService.getAllUsers().subscribe(
            (result) => {
                this.userList = result;
            },
            (err) => {
                console.log(err);
            }
        );
    }


    getReportingUserList(url) {
        this.userService.getReportingUserList(url).subscribe(
            (result) => {
                this.userReportingUserList = result;
                if (this.userReportingUserList.length > 0) {
                    this.showReportingTo = true;
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onSearch(searchValue) {

        this.showGrid = false;
        this.userSearchParam = searchValue;
        this.userService.onSearch(this.userSearchParam).subscribe(
            (result) => {
                if (result.length > 0) {
                    this.searchResult = result;
                    this.userSearchResult = result;
                    this.showGrid = true;
                    this.showForm = true;
                    this.userDatasource = result;
                    this.userTotalRecords = result.length;
                    this.userGridloading = false;

                    if (this.searchResult != null && this.searchResult.length > 0) {
                        for (var searchResultIndex = 0; searchResultIndex < this.searchResult.length; searchResultIndex++) {
                            var user = this.searchResult[searchResultIndex];
                            if (user.teamLeadId != null && user.teamLeadId != 0) {
                                var reportingTo = this.userList.filter(x => x.userId == user.teamLeadId)[0];
                                user.reportingTo = reportingTo.userName;
                            } else {
                                user.reportingTo = 'N/A';
                            }
                        }
                        this.showError = false;
                        this.showGrid = true;
                    }
                    else if (this.userSearchParam != null)
                    {
                        this.showError = true;
                        this.showGrid = false;
                    }
                }
                else {
                    this.showGrid = false;
                    this.showError = true;
                    this.showForm = true;
                }
            },
            (err) => {
                console.log(err);
                this.showFailure(err);
            }
        );

    }

    loadUserDetails(event: LazyLoadEvent) {
        this.userGridloading = true;
        setTimeout(() => {
            if (this.userDatasource) {
                this.userSearchResult = this.userDatasource.slice(event.first, (event.first + event.rows));
                this.userGridloading = false;
            }
        }, 500);
    }


    onSubmit() {
        this.submitted = true;
        this.errorMessage = ''
        if (this.formUserMgntUserMgt.invalid) {
            return false;
        }
        else {
            let user = new User();
            user.userName = this.formUserMgntUserMgt.getRawValue().userName;
            user.lastName = this.formUserMgntUserMgt.value.lastName;
            user.firstName = this.formUserMgntUserMgt.value.firstName;
            user.userEmail = this.formUserMgntUserMgt.getRawValue().userEmail;
            user.teamLeadId = this.formUserMgntUserMgt.value.teamLeadId;
            user.userRoleId = this.formUserMgntUserMgt.value.userRoleId;
            user.systemId = this.formUserMgntUserMgt.value.systemId;
            user.createdBy = this.loggedInUser;
            user.active = true;

            if (this.isUpdate) {
                if (this.userIdMgnt != null) {
                    user.userId = this.userIdMgnt;
                    user.modifiedBy = this.loggedInUser;
                }
                this.userService.updateUser(user).subscribe(
                    (result) => {
                        this.submitted = false;
                        this.isDirtyUserMgnt = false;
                        this.showSuccess('Successfully Updated User:: ' + user.userEmail);
                        this.isUpdate = false;
                        this.onReset();
                        this.onSearch(this.userSearchParam);
                    },
                    (err) => {
                        this.errorMessage = err;
                        console.log(err);
                        this.showFailure(err);
                    }
                );
            } else {

                this.userService.createUser(user).subscribe(
                    (result) => {
                        this.submitted = false;
                        this.isDirtyUserMgnt = false;
                        this.showSuccess('Successfully Added User:: ' + result.userName);
                        this.onReset();
                        this.onSearch(this.userSearchParam);
                    },
                    (err) => {
                        this.errorMessage = err;
                        console.log(err);
                        this.showFailure(err);

                    }
                );
            }

        }
    }

    onCancel() {
        this.submitted = false;
        this.onReset();
        this.isUpdate = false;
        this.formUserMgntUserMgt.controls['userEmail'].enable();
        this.showGrid = true;
    }

   onActivateOrDeactivate(user, isActive) {
      user.active = isActive;
      if (this.userIdMgnt != null) {
          user.userIdMgnt = this.userIdMgnt;
          user.modifiedBy = this.loggedInUser;
      }
      this.userService.updateUser(user).subscribe(
          (result) => {
              this.submitted = false;
              this.isDirtyUserMgnt = false;
              this.showSuccess('Successfully Updated User:: ' + user.userName);
              this.isUpdate = false;
              this.onReset();
              this.onSearch(this.userSearchParam);
          },
          (err) => {
              this.errorMessage = err;
              console.log(err);
              this.showFailure(err);
          }
      );
    }

    onEdit(user) {
        this.showGrid = false;
        this.showForm = true;
        let arr = [];

        this.formUserMgntUserMgt.patchValue(
            {
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                userRoleId: user.userRoleId,
                teamLeadId: user.teamLeadId,
                systemId: user.systemId
            }
        );
        this.formUserMgntUserMgt.controls['userEmail'].disable();
        this.isUpdate = true;
        this.userIdMgnt = user.userIdMgnt;
        this.router.navigate(['/dashboard/admin/userManagement']);
    }

    showSuccess(msg) {
        this.toastr.success(msg);
    }

    showFailure(msg) {
        this.toastr.error(msg);
    }

    showInfo(msg) {
        this.toastr.info(msg);
    }

    onReset() {
        this.formUserMgntUserMgt.markAsPristine();
        this.formUserMgntUserMgt.markAsUntouched();
        this.formUserMgntUserMgt.get("userName").reset();
        this.formUserMgntUserMgt.get("userEmail").reset();
        this.formUserMgntUserMgt.get("firstName").reset();
        this.formUserMgntUserMgt.get("lastName").reset();
        this.formUserMgntUserMgt.get("userRoleId").setValue('');
        if (this.formUserMgntUserMgt.get("teamLeadId") != null) this.formUserMgntUserMgt.removeControl("teamLeadId");
        if (this.formUserMgntUserMgt.get("systemId") != null) {
            this.formUserMgntUserMgt.removeControl("systemId");
        }
        this.showSystems = false;
        this.showReportingTo = false;
        this.submitted = false;
    }

}
