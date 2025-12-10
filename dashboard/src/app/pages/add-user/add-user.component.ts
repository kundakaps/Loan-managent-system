import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  users=[]
  departments=[]
  loading=false
  addusers=false
  approveusers=false
  pendingUsers=[]

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getUsers()
    this.getDeparments()

    this.activatedRoute.url.subscribe(() => {
      // Access the last child segment of the current route
      const lastSegment = this.activatedRoute.snapshot.firstChild?.url[0]?.path;

      // Call the handler for the last child segment
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });
  }


  handleRouteChange(route: string) {
    console.log(route);
    switch (route) {

      case 'addusers':
        this.showadduser();
        break;
      case 'approveusers':
        this.showapproveuser();
        break;
      default:
        break;
    }
  }
  showadduser(){
    this.addusers=true;
    this.approveusers=false;
    this.getUsers()
  }
  showapproveuser(){
    this.addusers=false;
    this.approveusers=true;
    this.getpendingusers();
  }

  getpendingusers(){
    this.loading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getpendinguser', { headers }).subscribe((response: any) => {
        this.pendingUsers = response['data'];
        $('#pendingusersTable').DataTable().clear().destroy();
        // Destroy existing DataTable if it has been initialized
        // if ($.fn.dataTable.isDataTable('#usersTable')) {
        //   $('#usersTable').DataTable().clear().destroy();
        // }

        setTimeout(() => {
          $('#pendingusersTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
          });
        }, 1);

        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      this.loading = false;
    }

  }

  confirmApproval(id:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to approve the user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading=true


      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }

        const body ={
          "status":"active"
        }

      try {
        this.http.put(BASE_URL+'/api/updateUserStatus/'+id, body, { headers }).subscribe((response:any)=>{

          Swal.fire({
            icon: 'success',
            title: 'success',
            text: response.message,
          });
          this.getpendingusers();


          this.loading=false
        })
      }
      catch(error){
        console.log(error)
        this.loading=false
      }

      }

    });
  }

  confirmReject(id:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject the user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // If the user confirms and writes a reason
        this.loading = true;

        // Log the rejection reason and the ID
        // console.log('Rejected message with ID:', id);
        // console.log('Rejection reason:', result.value);


      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      const body ={
        "status":"rejected"
      }

      try {
        this.http.put(BASE_URL+'/api/updateUserStatus/'+id,body, { headers }).subscribe((response:any)=>{

          Swal.fire({
            icon: 'success',
            title: 'success',
            text: response.message,
          });
          this.getpendingusers();


          this.loading=false
        })
      }
      catch(error){
        console.log(error)
        this.loading=false
      }

      }

    });
  }

  onSubmit(userForm: any) {
    if (userForm.valid) {
      console.log('Form Data:', userForm.value);
    }
    const body ={
      "name":userForm.value.name,
      "email":userForm.value.email,
      "password":"123456",

    }


    this.loading=true;

    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }

    try {
      this.http.post(BASE_URL+'/api/adduser',body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.getUsers();


        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }


  getUsers() {
    this.loading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getallusers', { headers }).subscribe((response: any) => {
        this.users = response['data'];
        $('#usersTable').DataTable().clear().destroy();
        // Destroy existing DataTable if it has been initialized
        // if ($.fn.dataTable.isDataTable('#usersTable')) {
        //   $('#usersTable').DataTable().clear().destroy();
        // }

        setTimeout(() => {
          $('#usersTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
          });
        }, 1);

        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }


  onRoleChange(event: any, user: any) {


    this.loading=true;
    const selectedRole = event.target.value;
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }

    const body ={
      "role":selectedRole,
      "user_id":user.id
  }

    try {
      this.http.post(BASE_URL+'/api/updateuserrole',body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.getUsers();


        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
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

  onDepartmentChange(event: any, user: any){

    this.loading=true;
    const selectDepartment = event.target.value;
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }

    const body ={
      "department_id":selectDepartment,
      "user_id":user.id
  }

    try {
      this.http.post(BASE_URL+'/api/updateuserdepartment',body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.getUsers();


        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }

}
