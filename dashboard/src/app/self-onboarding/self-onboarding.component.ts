import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-self-onboarding',
  templateUrl: './self-onboarding.component.html',
  styleUrls: ['./self-onboarding.component.scss']
})
export class SelfOnboardingComponent implements OnInit {
  isLoading =false
  test : Date = new Date();
  addUserSupportingData:any=[]

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getAddUserSupportData()
  }

   getAddUserSupportData() {

      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: 'Bearer ' + token };

      this.http.get(`${BASE_URL}/api/addemployeesupportdataself`, { headers })
        .subscribe(
          (response: any) => {
            this.isLoading = false;
            this.addUserSupportingData=response


          },
          (error) => {
            this.isLoading = false;
            Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
          }
        );
    }


    Formdata(data: any) {
      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: 'Bearer ' + token };

      this.http.post(`${BASE_URL}/api/Selfonboarding`, data, { headers })
        .subscribe(
          (response: any) => {
            this.isLoading = false;
            if (response.success) {
              Swal.fire(
                'Success',
                response.message,
                'success'
              ).then(() => {
                // Redirect to the home page after clicking "OK"
                window.location.href = '#/home';
              });
            } else {
              Swal.fire('Error', response.message, 'error');
            }
          },
          (error) => {
            this.isLoading = false;
            Swal.fire('Error', 'An error occurred while posting data.', 'error');
          }
        );
    }

}
