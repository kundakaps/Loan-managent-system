import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employee-updates',
  templateUrl: './employee-updates.component.html',
  styleUrls: ['./employee-updates.component.scss']
})
export class EmployeeUpdatesComponent implements OnInit {
constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.man_no = params["man_no"];
      this.getSingleEmployeeUpdate()

     });
     //this.roles = sessionStorage.getItem('role')?.split(',') || [];
  }
  man_no:any
  isLoading =false
  employeeDetails:any =[];

  getSingleEmployeeUpdate(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getsinglependingupdates/'+this.man_no, { headers }).subscribe((response:any)=>{
        this.employeeDetails=response.data[0].data
        console.log(this.employeeDetails)



        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }

  approve(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/approvependingupdates/'+this.man_no, { headers }).subscribe((response:any)=>{
        if(response.success) {
          Swal.fire({
            icon:'success',
            title: 'success',
            text: response.message,
          })
          this.router.navigate(['/employees/employee-updates'])
        } else {
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

}
