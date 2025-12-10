import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {


  constructor(private http: HttpClient,private route: Router) { }

  loading=false
  users=[]

  ngOnInit(): void {
    this.getUsers()
  }


  //get user
  getUsers(){
    //get users from service
    this.loading=true
    const token = localStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/v1/allusers', { headers }).subscribe((response:any)=>{
        this.users=response['users']
        setTimeout(() => {
          $('#users').DataTable({
              pagingType: 'full_numbers',
              pageLength: 5,
              processing: true,
              lengthMenu: [5, 10, 25],
          });
      }, 1);
        // console.log(this.users)
        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }


  }



}
