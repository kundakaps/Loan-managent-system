import { UsersService } from 'app/services/users.service';
import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../pages/config';
import Swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    username:any
    isLoading
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    private inactivityTimeout: any;
    private inactivityThreshold: number = 10 * 60 * 1000;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, private renderer : Renderer2, private element : ElementRef, private router: Router, private UsersService: UsersService, private http: HttpClient) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
       this.getusername()

       //inactivity
       this.startInactivityTimer();

       // Monitor user activity events (mousemove, keydown, scroll)
       document.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
       document.addEventListener('keydown', this.resetInactivityTimer.bind(this));
       document.addEventListener('scroll', this.resetInactivityTimer.bind(this));
    }
    private startInactivityTimer() {
      this.inactivityTimeout = setTimeout(() => {
        this.onInactivity();
      }, this.inactivityThreshold);
    }

    // Reset the inactivity timer
    private resetInactivityTimer() {
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }
      this.startInactivityTimer();
    }

    // Handle inactivity (redirect to /home)
    private onInactivity() {
       Swal.fire({
            icon: 'info',
            title: 'Session Expired',
            text: 'Your session has expired due to inactivity Please log in again.',
          });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
      this.router.navigate(['/home']);
    }



    getusername() {
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer ' + token };
      try {
        this.http.get(BASE_URL + '/api/me', { headers }).subscribe(
          (response: any) => {
            const name = response['data']['name'];
            this.username = name;
            //console.log(response['data']['name'])
          },
          (error: any) => {
            if (error.status === 401) {
             // console.log('You are not authorized');
              //navigate to /home
              this.router.navigate(['/home']);


            } else {
              console.log(error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }


clockOut() {
  const token = sessionStorage.getItem('token');

  // Check if token exists
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'You are not logged in.',
    });
    return;
  }

  // SweetAlert2 confirmation dialog
  Swal.fire({
    title: 'Are you sure you want to clock out?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, clock out',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      title: 'font-bold', // Add a custom class for the title to make it bold
    },
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      // Proceed with clocking out
      const headers = { 'Authorization': 'Bearer ' + token };
      try {
        this.http.get(BASE_URL + '/api/clockout', { headers }).subscribe(
          (response: any) => {
            if (response['success'] === true) {
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("role");
              this.router.navigate(['/home']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error clocking out.',
              });
            }
          },
          (error: any) => {
            if (error.status === 401) {
              // Navigate to home if unauthorized
              this.router.navigate(['/home']);
            } else {
              console.error(error);
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  });
}





    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return '';
    }




    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

      logout(){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        this.router.navigate(['/home']);

      }

}
