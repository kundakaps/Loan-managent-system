import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-approvals',
  templateUrl: './employee-approvals.component.html',
  styleUrls: ['./employee-approvals.component.scss']
})
export class EmployeeApprovalsComponent implements OnInit {


  isAllEmployees: boolean = false;
  isPendingEmployees: boolean = false;
  isDetails: boolean = false;
  pendingEmployees:any=[];
  employees:any =[]
  employeeDetails:any = [];

  isLoading =false;

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
      case 'all-employees':
        this.showEmployees();
        break;
      case 'pending-employees':
        this.showpendingEmployees();
        break;


      default:
        break;
    }

  }
  showEmployees(){
    this.isAllEmployees = true;
    this.isPendingEmployees =false
    this.isDetails =false
    this.getEmployees()
  }

  showpendingEmployees(){
    this.isPendingEmployees =true;
    this.isAllEmployees = false;
    this.isDetails =false;
    this.getPendingEmployees()
  }

  showdetails(){
    this.isPendingEmployees =false;
    this.isAllEmployees = false;
    this.isDetails =true
  }

  getPendingEmployees(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/pendingemployees', { headers }).subscribe((response:any)=>{
        this.pendingEmployees=response['data']
        console.log(response['data'])
        $('#employeeTable').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#employeeTable').DataTable({
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

  getSingleEmployee(man_no:any){
      this.isLoading=true
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/pendingemployee/'+man_no, { headers }).subscribe((response:any)=>{
          this.employeeDetails=response['data']
          console.log(response)

          this.showdetails()
          this.isLoading=false
        })
      }
      catch(error){
        console.log(error)
        this.isLoading=false
      }
  }

  Approve(man_no){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/approvependingemployee/'+man_no, { headers }).subscribe((response:any)=>{
        if(response.success){
          Swal.fire({
            icon:'success',
            title: 'success',
            text: response.message,
          }).then(()=>{
            this.showpendingEmployees()
          })

        }else{
          Swal.fire({
            icon:'error',
            title: 'error',
            text: response.message,
          })
        }


        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }
  Reject(man_no){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/rejectpendingemployee/'+man_no, { headers }).subscribe((response:any)=>{
        if(response.success){
          Swal.fire({
            icon:'success',
            title: 'success',
            text: response.message,
          }).then(()=>{
            this.showpendingEmployees()
          })

        }else{
          Swal.fire({
            icon:'error',
            title: 'error',
            text: response.message,
          })
        }


        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }

  getEmployees(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/allemployees', { headers }).subscribe((response:any)=>{
        this.employees=response['data']
        $('#employeeTable').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#employeeTable').DataTable({
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

  viewDetails(man_no) {

    this.router.navigate(['/employee-details'], { queryParams: { man_no } });

  }


}
