import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'app/services/users.service';
import Swal from 'sweetalert2'
import { BASE_URL } from '../pages/config';
import { HttpClient } from '@angular/common/http';
import * as e from 'express';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private useData: UsersService, private router:Router,private http: HttpClient) { }

  isLoading =false;
  test : Date = new Date();
  username: any;

  ngOnInit(): void {
  }
  // getUserFormdata(data: any) {
  //   this.isLoading = true;

  //   this.http.post(BASE_URL + '/api/auth/login', data).subscribe(
  //     (response: any) => {
  //       const token = response['token'];

  //       if (token) {
  //         sessionStorage.setItem('token', token);
  //         sessionStorage.setItem('role', response['role']);
  //         this.router.navigate(['/dashboard']);
  //         this.isLoading = false;

  //         // Manually decode the token to get expiration time
  //         const decodedToken = this.parseJwt(token);
  //         const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  //         const currentTime = new Date().getTime();
  //         const timeUntilExpiration = expirationTime - currentTime;

  //         // Set a timeout to automatically log the user out when the token expires
  //         setTimeout(() => {
  //           this.logoutUser();
  //         }, timeUntilExpiration);
  //       } else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'Invalid credentials!',
  //         });

  //         this.isLoading = false;

  //       }
  //     },
  //     (error) => {
  //       // Handle the error response, like 403 or others
  //       if (error.status !== 200) {
  //        // console.log(error.error);

  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Access Denied',
  //           text: error.error.error,

  //         });

  //       }
  //       this.isLoading = false;
  //     }
  //   );
  // }

  getUserFormdata(data: any) {
    this.isLoading = true;
    //console.log(data);

    this.http.post(BASE_URL + '/api/auth/login', data).subscribe(
      (response: any) => {


       if(response.success){
        //console.log(response)
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('role', response.role);
        this.router.navigate(['/dashboard']);


       }else{
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: response.message,

        });

        this.isLoading = false;
       }

      },
      (error) => {
        // Handle the error response, like 403 or others
        if (error.status !== 200) {
         // console.log(error.error);

          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: error.error.error,

          });

        }
        this.isLoading = false;
      }
    );
  }



  submitOTP(body:any){
    this.isLoading=true

    this.http.post(BASE_URL + '/api/otp', body).subscribe(
      (response: any) => {
        const token = response['token'];

        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('role', response['roles']);
          this.router.navigate(['/landing']);
          this.isLoading = false;

          // Manually decode the token to get expiration time
          const decodedToken = this.parseJwt(token);
          const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
          const currentTime = new Date().getTime();
          const timeUntilExpiration = expirationTime - currentTime;

          // Set a timeout to automatically log the user out when the token expires
          setTimeout(() => {
            this.logoutUser();
          }, timeUntilExpiration);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'wrong or expired OTP',
          });

          this.isLoading = false;

        }
      },
      (error) => {
        // Handle the error response, like 403 or others
        if (error.status !== 200) {
         // console.log(error.error);

          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: error.error.error,

          });

        }
        this.isLoading = false;
      }
    );
  }



  // Function to manually decode JWT token
  parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  logoutUser() {
    // Clear session storage and redirect to login
    sessionStorage.clear();
    this.router.navigate(['/login']);
    Swal.fire({
      icon: 'info',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
    });
  }

}
