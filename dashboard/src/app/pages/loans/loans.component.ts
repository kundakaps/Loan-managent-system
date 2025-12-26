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
    isWaitingActivation = false
    facilities:any=[]
    customers:any=[]
    UnactivatedLoans:any=[]


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
      case 'waiting-activation':
        this.showWaitingActivation();
        break;


      default:
        break;
    }



  }

  showAddLoan() {
    this.isAddloan = true;
    this.isAllLoans = false;
    this.isWaitingActivation = false;
    this.getCustomers()
    this.getFacilities();
    }

    showAllLoans() {
    this.isAddloan = false;
    this.isAllLoans = true;
    this.isWaitingActivation = false;
    this.getLoans()
    }
    showWaitingActivation() {
    this.isAddloan = false;
    this.isAllLoans = false;
    this.isWaitingActivation = true;
    this.getUnactivatedLoans()
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
  getUnactivatedLoans(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/unactivatedloans', { headers }).subscribe((response:any)=>{

       this.UnactivatedLoans=response.data
      $('#loansunactivatedTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#loansunactivatedTable').DataTable({
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



  detailspage(id: any) {
    // --- MODAL 1: CHOOSE ACTION ---
        Swal.fire({
          title: 'Choose Action',
          text: 'What would you like to do?',
          icon: 'question',
          showCancelButton: true,
          showDenyButton: true,

          // Buttons
          confirmButtonText: 'Make Repayment', // Yellow
          denyButtonText: 'View Loan Details', // Blue
          cancelButtonText: 'Close',

          // Theme Colors
          confirmButtonColor: '#ffc107',
          denyButtonColor: '#007bff',
          cancelButtonColor: '#6c757d',

        }).then((result) => {

          // ---------------------------------------------------
          // ACTION 1: MAKE REPAYMENT (Opens Input Modal)
          // ---------------------------------------------------
          if (result.isConfirmed) {

            Swal.fire({
              title: 'Enter Repayment Amount',
              text: `Enter the amount for Loan ID: ${id}`,
              input: 'number', // Defines the input type
              inputAttributes: {
                min: '1',       // specific html attributes
                step: '0.01'    // allow decimals
              },
              showCancelButton: true,
              confirmButtonText: 'Submit Payment',
              confirmButtonColor: '#ffc107', // Keeping the Yellow theme for payment
              cancelButtonColor: '#6c757d',

              // Validation: prevents submitting empty values
              inputValidator: (value) => {
                if (!value) {
                  return 'You need to enter an amount!';
                }
                return null; // Return null implies valid
              }
            }).then((paymentResult) => {

              // Check if they clicked Submit on the input modal
              if (paymentResult.isConfirmed) {
                const amount = paymentResult.value;

                // --- FINAL OUTPUT ---
                console.log('Action: Submit Repayment');
                console.log('Loan ID:', id);
                console.log('Amount Entered:', amount);

                this.submitPayment(id, amount)

                // Optional: Show a success message after
                //Swal.fire('Success', 'Repayment recorded!', 'success');
              }
            });

          }

          // ---------------------------------------------------
          // ACTION 2: VIEW DETAILS
          // ---------------------------------------------------
          else if (result.isDenied) {

            // Your navigation logic here
            this.router.navigate(['/loan-details'], { queryParams: { id } });
          }

        });
  }


  submitPayment(id: any, amount: any) {
        this.isLoading = true



          const url = BASE_URL+'/api/makerepayment';
          const body = {
            "loan_id": id,
            "amount": amount
          };

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
              this.showAllLoans()

            }else{
              Swal.fire('Error', response.message, 'error');
            }


            },
            error: (error) => {

              this.isLoading =false
              console.error('Error occurred:', error);
              alert('Failed to create customer.');
            }
          });


  }




}
