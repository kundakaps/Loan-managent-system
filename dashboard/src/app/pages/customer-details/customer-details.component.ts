import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  isLoading = false;
  id: any;
  customerDetails: any = null;
  role:any = sessionStorage.getItem('role');


  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
      if(this.id) {
        this.getCustomerDetails();
      }
    });
  }

    getCustomerDetails() {
      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };


      this.http.get(BASE_URL + '/api/customer/'+this.id,  { headers }).subscribe({
        next: (response: any) => {
          this.customerDetails = response;

          $('#loansTable').DataTable().clear().destroy();

          setTimeout(() => {
            var table = $('#loansTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 15,
              processing: true,
              lengthMenu: [15, 25, 50],
            });



          }, 1);

          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          Swal.fire('Error', 'Could not customer details', 'error');
        }
      });

    }

  protected loadDetails(id) {
    this.router.navigate(['/loan-details'], { queryParams: { id } });
  }
}
