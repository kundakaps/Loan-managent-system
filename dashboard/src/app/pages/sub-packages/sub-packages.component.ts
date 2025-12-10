import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-packages',
  templateUrl: './sub-packages.component.html',
  styleUrls: ['./sub-packages.component.scss']
})
export class SubPackagesComponent implements OnInit {
  packages=[]
  loading=false

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getpackages();
  }


  onSubmit(userForm: any) {
    if (userForm.valid) {
      console.log('Form Data:', userForm.value);
    }

   console.log('Submit Data:', userForm.value);


    this.loading=true;

    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }

    try {
      this.http.post(BASE_URL+'/api/updatesubamount',userForm.value, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.getpackages();


        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }


  getpackages() {
    this.loading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getsubpackages', { headers }).subscribe((response: any) => {
        this.packages = response['data'];
        $('#packageTable').DataTable().clear().destroy();
        // Destroy existing DataTable if it has been initialized
        // if ($.fn.dataTable.isDataTable('#usersTable')) {
        //   $('#usersTable').DataTable().clear().destroy();
        // }

        setTimeout(() => {
          $('#packageTable').DataTable({
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


}
