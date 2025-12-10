
import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

   isLoading =false
   isAddCustomer =false
   isAllCustomers = false
   customers:any=[]


 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

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
      case 'add-customer':
        this.showAddCustomer();
        break;
      case 'all-customers':
        this.showAllCustomers();
        break;


      default:
        break;
    }

  }

  showAddCustomer(){
    this.isAddCustomer = true;
    this.isAllCustomers = false;
  }
  showAllCustomers(){
    this.isAllCustomers = true;
    this.isAddCustomer = false;
    this.getCustomers()
  }

 submitForm(form: NgForm) {
    this.isLoading = true
    if (form.valid) {
      console.log('Sending data...', form.value);

      const url = BASE_URL+'/api/addcustomer';
      const body = form.value;

       const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }

      // 3. Make the POST request
      this.http.post(url, body, { headers }).subscribe({
        next: (response:any) => {
        this.isLoading =false
        if(response.success){
          Swal.fire(
            'Success',
            response.message,
            'success'
          )
          // .then(() => {
          //   this.router.navigate(['/events/all-events']);
          // });

        }else{
          Swal.fire('Error', response.message, 'error');
        }

          // Optional: Reset the form after success
          form.resetForm();
        },
        error: (error) => {

          this.isLoading =false
          console.error('Error occurred:', error);
          alert('Failed to create customer.');
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }

getCustomers(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/customers', { headers }).subscribe((response:any)=>{

       this.customers=response.data
      $('#customersTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#customersTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 15,
          processing: true,
          lengthMenu: [15, 25, 50],
        });



      }, 1);

        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }


}
