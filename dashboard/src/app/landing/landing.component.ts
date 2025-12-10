import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BASE_URL } from 'app/pages/config';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  test : Date = new Date();
  username;
  isLoading=false;
  roles: string[] = [];

  slideIndex: number = 0;
  images: string[] = [
    'assets/img/hands.jpg',
    'assets/img/bg.jpg',
    'assets/img/hands.jpg'
  ];

  interval: any;

  constructor(private http: HttpClient,private router: Router,) {

   }

  ngOnInit(): void {
    this.getusername()
    this.startSlideshow();
    const storedRoles = sessionStorage.getItem('role');

    if (storedRoles) {
      // Split the stored roles by commas and then extract part before the dash
      this.roles = storedRoles.split(',').map(role => role.split('-')[0]);
    }
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startSlideshow(): void {
    // Call the showSlides function every 3 seconds (3000 ms)
    this.interval = setInterval(() => {
      this.showSlides();
    }, 3000);
  }

  showSlides(): void {
    let slides = document.getElementsByClassName('slides') as HTMLCollectionOf<HTMLElement>;

    // Convert HTMLCollection to an array for iteration
    Array.from(slides).forEach((slide) => {
      slide.style.display = 'none'; // Hide all slides
    });

    // Update slideIndex and loop back if it exceeds the number of slides
    this.slideIndex++;
    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }

    slides[this.slideIndex - 1].style.display = 'block'; // Show the current slide
  }

  changeSlide(n: number): void {
    this.slideIndex += n;
    if (this.slideIndex > this.images.length) {
      this.slideIndex = 1;
    }
    if (this.slideIndex < 1) {
      this.slideIndex = this.images.length;
    }
    this.showSlides();
  }

  getusername(){
    const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/me', { headers }).subscribe((response:any)=>{
          const name =response['data']['first_name']+ " "+response['data']['last_name']
          this.username = name
          //console.log(response['data']['name'])


        })
      }
      catch(error){
        console.log(error)

      }
  }

  logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    this.router.navigate(['/home']);

  }


}
