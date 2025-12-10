import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-s-appointment',
  templateUrl: './s-appointment.component.html',
  styleUrls: ['./s-appointment.component.scss']
})
export class SAppointmentComponent implements OnInit {

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      // Access the last child segment of the current route
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;

      // Call the handler for the last child segment
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });

    this.GetSubmittedReports()
  }
  isPending = false
  isReports = false
  isLoading =false
  isDeclined =false
  isApproved=false
  reports:any=[]


  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'reports':
        this.showReports();
        break;
      case 'pending':
        this.showPending();
        break;
      case 'approved':
        this.showApproved();
        break;
      case 'declined':
        this.showDeclined();
        break;

      default:
        break;
    }

  }

  showReports(){
    this.isReports=true
    this.isPending=false
    this.isApproved=false
    this.isDeclined=false
  }

  showPending(){

  }

  showApproved(){

  }

  showDeclined(){

  }


  GetSubmittedReports(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getreport', { headers }).subscribe((response:any)=>{
        this.reports=response['data']
        $('#reportsTable').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#reportsTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
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

  showDetails(id:any) {
    this.router.navigate(['rm/report-details'],{queryParams:{id:id,}})
  }
}
