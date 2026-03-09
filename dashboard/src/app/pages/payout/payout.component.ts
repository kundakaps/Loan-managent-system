import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {

  isLoading = false;
  isNewPayout = false
  isPayoutHistory = false
  loanData:any =[]

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
   // this.initForm();
    this.route.url.subscribe(() => {
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });
  }



    handleRouteChange(route: string) {
    switch (route) {
      case 'new-payout':
        this.showNewPayout();
        break;
      case 'payout-history':
        this.showPayoutHistory();
        break;
      default:
        break;
    }
  }

  showNewPayout() {
    this.isNewPayout = true;
    this.isPayoutHistory = false;
    this.getLoans()
  }
  showPayoutHistory() {
    this.isNewPayout = false;
    this.isPayoutHistory = true;
  }

    getLoans(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/unpaidloans', { headers }).subscribe((response:any)=>{

       this.loanData=response.data
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

  detailspage(id: any) {
    this.router.navigate(['/loan-details'], { queryParams: { id } });
  }



}
