import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

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
    this.Localroles = sessionStorage.getItem('role')?.split(',') || [];

    this.getEmployees()
    this.getFamilyDocs()

  }
  isAllEmployees = false
  isAddEmployees = false
  isEmployeeUpdates = false
  isEmployeePositions =false
  isRoles =false
  isDocuments = false
  isLoading= false
  isFamilyDoc = true
  isQualificationDoc = false
  employees:any =[]
  employeesPendingUpdates:any =[]
  familyDocs:any =[]
  qualificationDocs:any =[]
  roles: any[] = [];
  userRoles: string[] = [];
  addUserSupportingData:any=[]
  Localroles:any

  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'all-employees':
        this.showEmployees();
        break;
      case 'add-employee':
        this.ShowAddEmployees();
        break;

      case 'documents':
        this.showDocuments();
        break;

        case 'employee-updates':
        this.showEmployeeUpdates();
        break;

        case 'employee-positions':
          this.showEmployeePositions();
          break;

      default:
        break;
    }

  }
  showEmployeePositions(){
    this.isAllEmployees=false
    this.isAddEmployees=false
    this.isRoles =false
    this.isDocuments = false
    this.isEmployeeUpdates = false
    this.isEmployeePositions = true
    this.getAddUserSupportData()
  }
  showEmployees(){
    this.isAllEmployees=true
    this.isAddEmployees=false
    this.isRoles =false
    this.isDocuments = false
    this.isEmployeeUpdates = false
    this.isEmployeePositions = false
    this.getEmployees()
  }

  showEmployeeUpdates(){
    this.isAllEmployees=false
    this.isAddEmployees=false
    this.isRoles =false
    this.isDocuments = false
    this.isEmployeeUpdates = true
    this.isEmployeePositions = false
    this.getPendingemployeesUpdates()
  }
  ShowAddEmployees(){
    this.isAllEmployees=false
    this.isAddEmployees=true
    this.isRoles =false
    this.isDocuments = false
    this.getAddUserSupportData()
    this.isEmployeePositions = false
    this.isEmployeeUpdates = false
  }
  showRoles(){
    this.isAllEmployees=false
    this.isAddEmployees=false
    this.isRoles =true
    this.isDocuments = false
    this.isEmployeePositions = false
    this.isEmployeeUpdates = false
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
          $('#employeePositionTable').DataTable().clear().destroy();

          setTimeout(() => {
            var table = $('#employeePositionTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 10,
              processing: true,
              lengthMenu: [10, 25, 50],
            });



          }, 1);
          //console.log(this.addUserSupportingData)
        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
        }
      );
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
         const buttonsHTML = record_status == "PENDING_HR" || record_status == "PENDING_CMHR" ? `
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
             if (record_status == "PENDING_HR" || record_status == "PENDING_CMHR") {
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

         this.http.post(`${BASE_URL}/api/updatefamilydocstatus`, body, { headers })
           .subscribe(
             (response: any) => {
               this.isLoading = false;
               if (response.success) {
                 Swal.fire('Success', response.message, 'success');
                 this.getFamilyDocs()
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

        SendQulificationDocUpdate(body: any) {
           this.isLoading = true;
           const token = sessionStorage.getItem('token');
           const headers = { Authorization: 'Bearer ' + token };

           this.http.post(`${BASE_URL}/api/updatequalificationdocstatus`, body, { headers })
             .subscribe(
               (response: any) => {
                 this.isLoading = false;
                 if (response.success) {
                   Swal.fire('Success', response.message, 'success');
                   this.getQualificationDocs()
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
        const buttonsHTML = record_status == "PENDING_HR" || record_status == "PENDING_CMHR"? `
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
          if (record_status == "PENDING_HR" || record_status == "PENDING_CMHR") {
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


  showDocuments(){
    this.isAllEmployees=false
    this.isAddEmployees=false
    this.isRoles =false
    this.isDocuments = true
    this.isEmployeeUpdates = false
    this.getFamilyDocs()
  }

  showFamily(){
    this.isFamilyDoc = true
    this.isQualificationDoc = false
    this.getFamilyDocs()
  }

  showQualifications(){
    this.isFamilyDoc = false
    this.isQualificationDoc = true
    this.getQualificationDocs()
  }

  getPendingemployeesUpdates(){
    this.isLoading=true
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/getpendingupdates', { headers }).subscribe((response:any)=>{
          this.employeesPendingUpdates=response['data']
          console.log(this.employees)
          $('#employeependingupdateTable').DataTable().clear().destroy();

          setTimeout(() => {
            var table = $('#employeependingupdateTable').DataTable({
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





  viewOptions(first_name, last_name, man_no) {
    Swal.fire({
      title: `<span style="font-size: 19px;">Choose an option for ${first_name.toLowerCase()} ${last_name.toLowerCase()}</span>`,
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <button id="assignRoleBtn" style="font-size: 14px; background-color: #A11F23; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Assign Role</button>
      <button id="viewDetailsBtn" style="font-size: 14px; background-color: #A11F23; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">View Details</button>
      <button id="activate2FABtn" style="font-size: 14px; background-color: #A11F23; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">2FA</button>
    `,
      didOpen: () => {
        // Add event listeners for the buttons
        document.getElementById('assignRoleBtn')?.addEventListener('click', () => {
          this.assignRole(man_no);
        });

        document.getElementById('viewDetailsBtn')?.addEventListener('click', () => {
          this.viewDetails(man_no);
          Swal.close();
        });

        document.getElementById('activate2FABtn')?.addEventListener('click', () => {
          this.activate2FA(man_no);
        });
      }
    });
  }

  async assignRole(man_no) {
    try {

      await Promise.all([
        this.getUserRoles(man_no),
        this.getRoles()
      ]);

      // After both promises resolve, show the modal
      this.showRoleSelectorModal(man_no);
    } catch (error) {
      console.log("Error in assigning role: ", error);
    }
  }



  showRoleSelectorModal(man_no) {
    // Role prefix mapping with type definition
    const rolePrefixNames: { [key: string]: string } = {
      'HR': 'Human Resource',
      'IP': 'Integrated Payments',
      'CR': 'Credit',
      'RM': 'Relationship Management',

    };

    // Extract unique role prefixes from role codes and ensure they're strings
    const rolePrefixes = [...new Set(this.roles['data'].map(role =>
      role.role_code.split('-')[0].toUpperCase()
    ))] as string[];

    // Create filter dropdown HTML
    const filterDropdownHtml = `
      <div style="margin-bottom: 20px;">
        <select id="role-filter" style="width: 200px; padding: 5px; margin-bottom: 15px;">
          <option value="all">All Roles</option>
          ${rolePrefixes.map(prefix =>
            `<option value="${prefix}">${rolePrefixNames[prefix] || prefix} Roles</option>`
          ).join('')}
        </select>
      </div>
    `;

    const checkboxesHtml = this.roles['data'].map(role => {
      const checked = this.userRoles['data'].includes(role.role_code) ? 'checked' : '';
      const rolePrefix = role.role_code.split('-')[0];
      return `
        <div class="role-item" data-role-prefix="${rolePrefix}"
             style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="role-${role.id}" value="${role.role_code}" ${checked}
                 style="margin-right: 10px;" />
          <label style="font-size:12px" for="role-${role.id}">${role.role_description}</label>
        </div>
      `;
    }).join('');

    Swal.fire({
      title: `<span style="font-size: 19px;">Select User Rights</span>`,
      html: `
        ${filterDropdownHtml}
        <div id="roles-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          ${checkboxesHtml}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      customClass: {
        confirmButton: 'swal-btn-save'
      },
      willOpen: () => {
        // Apply styles to confirm button
        const confirmButton = document.querySelector('.swal2-confirm') as HTMLElement;
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#A11F23';
          confirmButton.style.borderColor = '#A11F23';
        }

        // Add filter functionality
        const filterSelect = document.getElementById('role-filter') as HTMLSelectElement;
        filterSelect.addEventListener('change', (e) => {
          const selectedPrefix = (e.target as HTMLSelectElement).value.toLowerCase();
          const roleItems = document.querySelectorAll('.role-item');

          roleItems.forEach((item: HTMLElement) => {
            const prefix = item.getAttribute('data-role-prefix').toLowerCase();
            if (selectedPrefix === 'all' || prefix === selectedPrefix) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      },
      cancelButtonText: 'Cancel',
      width: '60%',
      padding: '20px',
      preConfirm: () => {
        const selectedRoles = [];
        this.roles['data'].forEach(role => {
          const checkbox = document.getElementById(`role-${role.id}`) as HTMLInputElement;
          if (checkbox && checkbox.checked) {
            selectedRoles.push(checkbox.value);
          }
        });
        return selectedRoles;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          "man_no": man_no,
          "roles": result.value
        }
        this.updateRole(body);
      }
    });
  }

  updateRole(body:any){
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.post(BASE_URL + '/api/updateuserroles',body, { headers }).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire('Success', response.message, 'success');
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        Swal.fire('Error', 'An error occurred while processing the request.', 'error');
      }
    );
  }

  getUserRoles(man_no): Promise<any> {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    return new Promise((resolve, reject) => {
      this.http.get(BASE_URL + '/api/employeeroles/' + man_no, { headers }).subscribe(
        (response: any) => {
         // console.log(response['data'].original?.success);
          if(response['data'].original?.success === false){

            this.isLoading = false;
            this.userRoles['data'] = [];

            resolve(response);

          }else{
          this.isLoading = false;
          this.userRoles = response;
          //console.log(this.userRoles);

          resolve(response);
          }


        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          reject(error);  // Reject the promise if there's an error
        }
      );
    });
  }

  getRoles(): Promise<any> {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    return new Promise((resolve, reject) => {
      this.http.get(BASE_URL + '/api/roletypes', { headers }).subscribe(
        (response: any) => {
          this.roles = response;
          //console.log(this.roles);
          this.isLoading = false;
          resolve(response);  // Resolve the promise when the HTTP request is successful
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          reject(error);  // Reject the promise if there's an error
        }
      );
    });
  }


  viewDetails(man_no) {

    this.router.navigate(['/employee-details'], { queryParams: { man_no } });

  }

  gotoDetails(man_no) {
    this.router.navigate(['/employee-updates'], { queryParams: { man_no } });
  }

  activate2FA(man_no) {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    return new Promise((resolve, reject) => {
      this.http.get(BASE_URL + '/api/2fastatus/' + man_no, { headers }).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.success === true) {
            const username = response.data.username;
            const status = response.data.status;

            // Display SweetAlert modal
            Swal.fire({
              title: ` ${username}`,
              text: `2FA Status: ${status == 'active' ? 'Active' : 'Inactive'}`,
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: status == 'active' ? 'Deactivate' : 'Activate',
              cancelButtonText: 'Cancel',
              preConfirm: () => {

                return this.activate2FAStatus(username, status);
              }
            });
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }

  activate2FAStatus(username, currentStatus) {
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };
    const action = currentStatus === 'active' ? 'inactive' : 'active';

   // console.log(action + ' 2FA for ' + username);
    const body ={
      "username": username,
      "status": action
    }

    this.isLoading = true;
    try {
      this.http.post(BASE_URL+'/api/update2fa',body, { headers }).subscribe((response:any)=>{

        if(response.success === true){
          Swal.fire({
            title: 'Success!',
            text: response.message,
            icon: 'success',
            showConfirmButton: true,
            //timer: 2000
          });

        }else{
          Swal.fire({
            title: 'Error!',
            text: response.message,
            icon: 'error',
            showConfirmButton: true,
            //timer: 2000
          });
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

    onPlusClick() {
      Swal.fire({
        title: 'Enter Position Details',
        html: `
          <label for="positionCode">Position Code:</label>
          <input id="positionCode" class="swal2-input" placeholder="Enter Position Code">

          <label for="positionDescription">Position Description:</label>
          <input id="positionDescription" class="swal2-input" placeholder="Enter Position Description">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#A11F23',
        preConfirm: () => {
          const positionCode = (document.getElementById('positionCode') as HTMLInputElement).value;
          const positionDescription = (document.getElementById('positionDescription') as HTMLInputElement).value;

          if (!positionCode || !positionDescription) {
            Swal.showValidationMessage('Please fill in both fields');
            return false;
          }

          // Log the values of the position code and description
          // console.log('Position Code:', positionCode);
          // console.log('Position Description:', positionDescription);

          this.createPosition(positionCode, positionDescription)
          return { positionCode, positionDescription };
        }
      });
    }

  createPosition(positionCode, positionDescription){
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer '+token }
      const body={
        "position_code": positionCode,
        "position_description": positionDescription
      }

      this.isLoading = true;
      try {
        this.http.post(BASE_URL+'/api/addposition',body, { headers }).subscribe((response:any)=>{

          if(response.success == true){
            this.getAddUserSupportData()
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon:'success',
              showConfirmButton: true,
              //timer: 2000
            });

          }else{
            Swal.fire({
              title: 'Error!',
              text: response.message,
              icon: 'error',
              showConfirmButton: true,
              //timer: 2000
            });
          }


          this.isLoading=false
        })
      } catch(error){
        console.log(error)
        this.isLoading=false
      }

    }

    deletePosition(code:any){

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this position?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading=true
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.delete(BASE_URL+'/api/deleteposition/'+code, { headers }).subscribe((response:any)=>{

          if(response.success == true){
            this.getAddUserSupportData()
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon:'success',
              showConfirmButton: true,
              //timer: 2000
            });

          }else{
            Swal.fire({
              title: 'Error!',
              text: response.message,
              icon: 'error',
              showConfirmButton: true,
              //timer: 2000
            });
          }


          this.isLoading=false
        })
      } catch(error){
        console.log(error)
        this.isLoading=false
      }
        } else {
          console.log('Deletion canceled');
        }
      });



    }


    getFamilyDocs(){
      this.isLoading=true
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/familydocuments', { headers }).subscribe((response:any)=>{
          this.familyDocs=response['data']
          $('#familyTable').DataTable().clear().destroy();

          setTimeout(() => {
            var table = $('#familyTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 10,
              processing: true,
              lengthMenu: [10, 25, 50],
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

    getQualificationDocs(){
      this.isLoading=true
      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL+'/api/qualificationdocuments', { headers }).subscribe((response:any)=>{
          this.qualificationDocs=response['data']
          $('#qualificationTable').DataTable().clear().destroy();

          setTimeout(() => {
            var table = $('#qualificationTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 10,
              processing: true,
              lengthMenu: [10, 25, 50],
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


    Formdata(data:any){

      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: 'Bearer ' + token };

      this.http.post(`${BASE_URL}/api/addemployee`,data, { headers })
        .subscribe(
          (response: any) => {
            this.isLoading = false;
            if (response.success) {
              Swal.fire(
                'Success',
                response.message,
                'success');

                this.showEmployees()


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
