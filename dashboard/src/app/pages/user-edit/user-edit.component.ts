import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

   constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {}
    man_no:any
    employeeDetails:any =[];
    addUserSupportingData:any=[];
    isLoading=false

  ngOnInit(): void {
    this.getSingleEmployee()
    this.getAddUserSupportData()
  }


    getSingleEmployee(){
      this.isLoading=true
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/employee', { headers }).subscribe((response:any)=>{
          this.employeeDetails=response
          console.log(this.employeeDetails)
          // $('#employeeTable').DataTable().clear().destroy();

          // setTimeout(() => {
          //   var table = $('#employeeTable').DataTable({
          //     pagingType: 'full_numbers',
          //     pageLength: 15,
          //     processing: true,
          //     lengthMenu: [15, 25, 50],
          //   });



          // }, 1);


          // $('#familyTable').DataTable().clear().destroy();

          // setTimeout(() => {
          //   var table = $('#familyTable').DataTable({
          //     pagingType: 'full_numbers',
          //     pageLength: 15,
          //     processing: true,
          //     lengthMenu: [15, 25, 50],
          //   });



          // }, 1);


          this.isLoading=false
        })
      }
      catch(error){
        console.log(error)
        this.isLoading=false
      }

  }

  getAddUserSupportData() {

      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: 'Bearer ' + token };

      this.http.get(`${BASE_URL}/api/addemployeesupportdata`, { headers })
        .subscribe(
          (response: any) => {
            this.isLoading = false;
            this.addUserSupportingData=response
            //console.log(this.addUserSupportingData)
          },
          (error) => {
            this.isLoading = false;
            Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
          }
        );
    }

    UpDateData(data:any){
      this.isLoading = true;
          const token = sessionStorage.getItem('token');
          const headers = { Authorization: 'Bearer ' + token };

          this.http.post(`${BASE_URL}/api/userupdateemployee`,data, { headers })
            .subscribe(
              (response: any) => {
                this.isLoading = false;
                if (response.success) {
                  Swal.fire(
                    'Success',
                    response.message,
                    'success');

                   this.getSingleEmployee()


                } else {
                  Swal.fire('Error', response.message, 'error');
                }

              },
              (error) => {
                this.isLoading = false;
                Swal.fire('Error', 'An error occurred while posting data.', 'error');
              }
            );
    }
}
