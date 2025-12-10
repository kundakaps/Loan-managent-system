import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  departments=[]
  loading=false
  required=false

  constructor(private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getDeparments()
  }


  adddepartment(data){
    // console.log(data)
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }



    try {
      this.http.post(BASE_URL+'/api/adddepartments',data, { headers }).subscribe((response:any)=>{


      //Swal.fire(response.message);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.message,
      });
      this.getDeparments();
      this.loading=false
      })
    }
    catch(error){
      console.log(error)
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: error.error.message,
      });
    }
  }

  getDeparments(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/alldepartments', { headers }).subscribe((response:any)=>{
        this.departments=response['data']
        $('#departmentTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#departmentTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 5,
              processing: true,
              lengthMenu: [5, 10, 25],
          });
      }, 1);

        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }
}
