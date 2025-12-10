import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.man_no = params["man_no"];
      this.getSingleEmployee()

     });
     this.roles = sessionStorage.getItem('role')?.split(',') || [];
  }
  man_no:any
  employeeDetails:any =[];
  isLoading=false
  roles:any

    getSingleEmployee(){
        this.isLoading=true
        const token = sessionStorage.getItem('token');
        //console.log("token is: "+token)
        const headers = { 'Authorization': 'Bearer '+token }
        try {
          this.http.get(BASE_URL+'/api/employeedetails/'+this.man_no, { headers }).subscribe((response:any)=>{
            this.employeeDetails=response
            //console.log(this.employeeDetails)
            $('#employeeTable').DataTable().clear().destroy();

            setTimeout(() => {
              var table = $('#employeeTable').DataTable({
                pagingType: 'full_numbers',
                pageLength: 15,
                processing: true,
                lengthMenu: [15, 25, 50],
              });



            }, 1);


            $('#familyTable').DataTable().clear().destroy();

            setTimeout(() => {
              var table = $('#familyTable').DataTable({
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

    pullFamilyDoc(id: any) {
        this.isLoading = true;
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: 'Bearer ' + token };

        this.http.get(`${BASE_URL}/api/getsinglefamilydoc/${id}`, { headers })
          .subscribe(
            (response: any) => {
              this.isLoading = false;
              if (response.success) {
                const supportingDoc = response.data[0]?.supporting_doc;
                if (supportingDoc) {
                  this.showDocumentModal(supportingDoc, id, response.data[0]?.record_status);
                } else {
                  Swal.fire('No Document', 'No supporting document found.', 'info');
                }
              } else {
                Swal.fire('Error', response.message, 'error');
              }
            },
            (error) => {
              this.isLoading = false;
              Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
            }
          );
      }
      pullQualificationDic(id: any) {
        this.isLoading = true;
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: 'Bearer ' + token };

        this.http.get(`${BASE_URL}/api/getsinglequalificationdoc/${id}`, { headers })
          .subscribe(
            (response: any) => {
              this.isLoading = false;
              if (response.success) {
                const certificate = response.data[0]?.certificate;
                if (certificate) {
                  this.showQualificationDocumentModal(certificate,id,response.data[0]?.record_status);
                } else {
                  Swal.fire('No Document', 'No supporting document found.', 'info');
                }
              } else {
                Swal.fire('Error', response.message, 'error');
              }
            },
            (error) => {
              this.isLoading = false;
              Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
            }
          );
      }

      showDocumentModal(base64Data: string, id: any, record_status) {
        // Check if the record status is "pending_hr"
        const buttonsHTML = record_status == "PENDING_HR" ? `
          <div id="buttonContainer" style="display: flex; justify-content: center; margin-top: 15px;">
            <button id="approveBtn" class="swal2-btn" style="background-color: #A11F23; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius:30px">Approve</button>
            <button id="rejectBtn" class="swal2-btn" style="background-color: red; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius:30px">Reject</button>
          </div>
        ` : ''; // If not "pending_hr", leave it empty

        Swal.fire({
          title: 'Supporting Document',
          html: `
            <iframe src="data:application/pdf;base64,${base64Data}" width="100%" height="500px"></iframe>
            ${buttonsHTML}
          `,
          showCloseButton: true,
          showConfirmButton: false,
          width: '80%',
          didOpen: () => {
            if (record_status == "PENDING_HR") {
              document.getElementById('approveBtn')?.addEventListener('click', () => {
                const body = {
                  "status": 'COMPLETE',
                  "id": id
                }
                this.SendFamilyDocUpdate(body)
                Swal.close();
              });

              document.getElementById('rejectBtn')?.addEventListener('click', () => {
                Swal.fire({
                  title: 'Enter Rejection Reason',
                  input: 'textarea',
                  inputPlaceholder: 'Type your reason here...',
                  showCancelButton: true,
                  confirmButtonText: 'Submit',
                  inputValidator: (value) => {
                    if (!value) {
                      return 'You must enter a reason for rejection';
                    }
                  }
                }).then((result) => {
                  if (result.isConfirmed) {
                    const body = {
                      "status": 'REJECTED',
                      "id": id,
                      "reason": result.value
                    }
                    this.SendFamilyDocUpdate(body)
                  }
                });
              });
            }
          }
        });
      }


      SendFamilyDocUpdate(body: any) {
        this.isLoading = true;
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: 'Bearer ' + token };

        this.http.post(`${BASE_URL}/api/updatefamilydocstatus/`, body, { headers })
          .subscribe(
            (response: any) => {
              this.isLoading = false;
              if (response.success) {
                Swal.fire('Success', response.message, 'success');
                this.getSingleEmployee()
              } else {
                Swal.fire('Error', response.message, 'error');
              }
            },
            (error) => {
              this.isLoading = false;
              Swal.fire('Error', 'An error occurred.', error);
            }
          );
      }


      showQualificationDocumentModal(base64Data: string,id,record_status) {
       // Check if the record status is "pending_hr"
       const buttonsHTML = record_status == "PENDING_HR" ? `
       <div id="buttonContainer" style="display: flex; justify-content: center; margin-top: 15px;">
         <button id="approveQBtn" class="swal2-btn" style="background-color: #A11F23; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius:30px">Approve</button>
         <button id="rejectQBtn" class="swal2-btn" style="background-color: red; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius:30px">Reject</button>
       </div>
     ` : ''; // If not "pending_hr", leave it empty

     Swal.fire({
       title: 'Supporting Document',
       html: `
         <iframe src="data:application/pdf;base64,${base64Data}" width="100%" height="500px"></iframe>
         ${buttonsHTML}
       `,
       showCloseButton: true,
       showConfirmButton: false,
       width: '80%',
       didOpen: () => {
         if (record_status == "PENDING_HR") {
           document.getElementById('approveQBtn')?.addEventListener('click', () => {
             const body = {
               "status": 'COMPLETE',
               "id": id
             }
             this.SendQulificationDocUpdate(body)
             Swal.close();
           });

           document.getElementById('rejectQBtn')?.addEventListener('click', () => {
             Swal.fire({
               title: 'Enter Rejection Reason',
               input: 'textarea',
               inputPlaceholder: 'Type your reason here...',
               showCancelButton: true,
               confirmButtonText: 'Submit',
               inputValidator: (value) => {
                 if (!value) {
                   return 'You must enter a reason for rejection';
                 }
               }
             }).then((result) => {
               if (result.isConfirmed) {
                 const body = {
                   "status": 'REJECTED',
                   "id": id,
                   "reason": result.value
                 }
                 this.SendQulificationDocUpdate(body)
               }
             });
           });
         }
       }
     });
     }

    SendQulificationDocUpdate(body: any) {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + token };

    this.http.post(`${BASE_URL}/api/updatequalificationdocstatus/`, body, { headers })
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.success) {
            Swal.fire('Success', response.message, 'success');
            this.getSingleEmployee()
          } else {
            Swal.fire('Error', response.message, 'error');
          }
        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'An error occurred.', error);
        }
      );
  }

  goToEdit(man_no:any){
    //console.log(man_no)
    this.router.navigate(['/edit'], { queryParams: { man_no } });
  }

}
