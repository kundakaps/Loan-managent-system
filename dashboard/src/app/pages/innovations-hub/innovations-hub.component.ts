import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-innovations-hub',
  templateUrl: './innovations-hub.component.html',
  styleUrls: ['./innovations-hub.component.scss']
})
export class InnovationsHubComponent implements OnInit {

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}
 isSubmission=false;
 isLoading =false;
  ngOnInit(): void {

     // Subscribing to changes in child routes
  this.route.url.subscribe(() => {
    // Access the last child segment of the current route
    const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;
    if (lastSegment) {
      this.handleRouteChange(lastSegment);
    }
  });
  }

  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'submit-innovation':
        this.showSubmission();
        break;

      default:
        break;
    }

  }


  showSubmission(){
    this.isSubmission =true
  }


  Formdata(data:any){
    //console.log(data)

     this.isLoading = true;
              const token = sessionStorage.getItem('token');
              const headers = { Authorization: 'Bearer ' + token };

              this.http.post(`${BASE_URL}/api/innovationsubmission`, data, { headers })
                .subscribe(
                  (response: any) => {
                    this.isLoading = false;
                    if (response.success) {
                      Swal.fire(
                        'Success',
                        response.message,
                        'success'
                      ).then((result) => {
                        if (result.isConfirmed) {
                          // Redirect to dashboard after the alert is confirmed
                          this.router.navigate(['/dashboard']);
                        }
                      });

                        // this.showQualification()


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
