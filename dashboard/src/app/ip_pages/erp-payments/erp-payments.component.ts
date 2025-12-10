import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-erp-payments',
  templateUrl: './erp-payments.component.html',
  styleUrls: ['./erp-payments.component.scss']
})
export class ErpPaymentsComponent implements OnInit {
  isERPPayments=false
  selectedInstitution: string = '';
  isAccountDetails=false

  institutions:any =[]
  customerDetails:any =[]
  institutionName:any
  isLoading=false

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {

      // Subscribing to changes in child routes
      this.route.url.subscribe(() => {
        // Access the last child segment of the current route
        const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;

        // Call the handler for the last child segment
        if (lastSegment) {
          this.handleRouteChange(lastSegment);
        }
      });

      this.getInsititutions()
  }
  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'newpayment':
        this.showERPPayments();
        break;

      default:
        break;
    }

  }
  showERPPayments(){
    this.isERPPayments=true
  }

  getInsititutions(){
    this.isLoading= true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
      this.http.get(BASE_URL + '/api/integratedpayments/erp/institutionlist', { headers }).subscribe(
        (response: any) => {
          this.isLoading= false

          this.institutions = response['data'];

        },
        (error: any) => {
          if (error.status === 401) {
           // console.log('You are not authorized');
            //navigate to /home
            this.router.navigate(['/home']);


          } else {
            this.isLoading= false
            console.log(error);
          }
        }
      );
    } catch (error) {
      this.isLoading= false
      console.log(error);
    }
  }



  Formdata(data:any){
    this.isLoading= true

    const body = {
      "accountNumber":data.account_no,
      "institutionId":data.name
    }





    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
      this.http.post(BASE_URL + '/api/integratedpayments/erp/kyclookup',body, { headers }).subscribe(
        (response: any) => {
          this.isLoading= false

          this.customerDetails = response['data'];

        const  institutionName = this.getInstitutionNameById(data.name);
        this.institutionName =institutionName
          this.isAccountDetails=true

        },
        (error: any) => {
          if (error.status === 401) {
           // console.log('You are not authorized');
            //navigate to /home
            this.router.navigate(['/home']);


          } else {
            this.isLoading= false
            console.log(error);
          }
        }
      );
    } catch (error) {
      this.isLoading= false
      console.log(error);
    }
  }

  getInstitutionNameById(institutionID: string): string | undefined {
    const filteredInstitution = this.institutions.filter(item => item.institutionID === institutionID);
    return filteredInstitution.length > 0 ? filteredInstitution[0].institutionName : undefined;
  }

}
