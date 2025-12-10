import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss']
})
export class ContributionsComponent implements OnInit {

  contributions=[]
  loading=false
  required=false
  pop: string = '';
  constructor(private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getContributions();
  }
  formData: FormData = new FormData();
  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(field, file);

      // Update file name variables
      if (field === 'pop') {
        this.pop = file.name;
      }
    }
  }

  addContributions(data:any){
    this.loading=true

    const token=sessionStorage.getItem('token');
    const headers ={ 'Authorization': 'Bearer '+token}
    this.formData.append('month', data.value.month);
    this.formData.append('amount', data.value.amount);
   // console.log(this.formData)

    try {
      this.http.post(BASE_URL+'/api/addcontributions',this.formData, { headers }).subscribe((response:any)=>{


      //Swal.fire(response.message);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.message,
      });
      this.getContributions();
      this.loading=false
      })
    }
    catch(error){
      console.log(error)
    }

  }
  getContributions(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getcontributions', { headers }).subscribe((response:any)=>{
        this.contributions=response['data']
        $('#contributionsTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#contributionsTable').DataTable({
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
