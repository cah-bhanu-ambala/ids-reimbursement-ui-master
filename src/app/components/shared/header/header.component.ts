import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/classes/user';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showMenu: boolean = false;
  currentUser: User;

  @ViewChild('toggleDropdown') toggleButton: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
    /**
         * This events get called by all clicks on the page
         */
     this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && e.target!==this.dropdownMenu.nativeElement){
          this.showMenu=false;
      }});
   }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

  onUser() {
    if (this.showMenu == true) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }

  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    if(environment.tunOffOktaLogout){
        this.router.navigate(['/register/login'])
    } else {
        this.authService.logout()
    }
  }
}


