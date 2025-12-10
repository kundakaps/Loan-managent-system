import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {


    Loans:any=[]
    isLoading =false
    isAddloan =false
    isAllLoans = false
    facilities:any=[]
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
      case 'add-loan':
        this.showAddLoan();
        break;
      case 'all-loans':
        this.showAllLoans();
        break;


      default:
        break;
    }



  }

  showAddLoan() {
    this.isAddloan = true;
    this.isAllLoans = false;
    this.getCustomers()
    this.getFacilities();
    }

    showAllLoans() {
    this.isAddloan = false;
    this.isAllLoans = true;
    this.getLoans()
    }


  getCustomers(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/customers', { headers }).subscribe((response:any)=>{

       this.customers=response.data
       console.log(this.customers)
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


    loanModel = {
    client_id: '',
    facility_id: '',
    amount: null,
    tenure: null,
    next_payment: '',
    monthly_repayment: 0 // This will store the calculated result
  };

   calculateMonthlyRepayment() {
    // Ensure we have the necessary values before calculating
    if (this.loanModel.amount && this.loanModel.tenure && this.loanModel.facility_id) {

      // Find the selected facility object to get the percentage
      // note: using == instead of === just in case the ID comes as a string from the select
      const selectedFacility = this.facilities.find(f => f.id == Number(this.loanModel.facility_id));

      if (selectedFacility) {
        const principal = Number(this.loanModel.amount);
        const tenureMonths = Number(this.loanModel.tenure);
        const rate = selectedFacility.facility_percentage;

        // --- MATH LOGIC ---
        // Adjust this formula based on your specific business requirement.
        // Example: Simple Interest (Principal + Interest) / Months
        const totalInterest = principal * (rate / 100);
        const totalAmount = principal + totalInterest;
        const monthly = totalAmount / tenureMonths;

        // Fix to 2 decimal places
        this.loanModel.monthly_repayment = parseFloat(monthly.toFixed(2));
      }
    } else {
      this.loanModel.monthly_repayment = 0;
    }
  }

   submitForm(form: NgForm) {
        this.isLoading = true
        if (form.valid) {
          console.log('Sending data...', form.value);

          const url = BASE_URL+'/api/addloan';
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

  getFacilities(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/allfacilities', { headers }).subscribe((response:any)=>{

       this.facilities=response.data
      $('#facilityTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#facilityTable').DataTable({
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

  getLoans(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/allloans', { headers }).subscribe((response:any)=>{

       this.Loans=response.data
      $('#loansTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#loansTable').DataTable({
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
