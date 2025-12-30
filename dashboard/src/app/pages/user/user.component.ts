import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    styleUrls: ['./user.component.scss'],
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit{

  isAddUser = false
  isAllUser = false
  isLoading = false
  users:any=[]

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
      case 'add-user':
        this.showAddUser();
        break;
      case 'all-users':
        this.showAllUser();
        break;

      default:
        break;
    }



  }
   showAddUser() {
    this.isAddUser = true;
    this.isAllUser = false;
    }

    showAllUser() {
    this.isAddUser = false;
    this.isAllUser = true;

    this.getUsers()
  }

  getUsers(){
    //this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/users', { headers }).subscribe((response:any)=>{

       this.users=response.data
      $('#usersTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#usersTable').DataTable({
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



addUser() {
  Swal.fire({
    title: '<strong style="color: #0056b3;">ADD NEW USER</strong>',
    html: `
      <div style="text-align: left; padding: 10px;">
        <div class="form-group">
          <label for="swal-name">Full Name</label>
          <input id="swal-name" class="form-control" style="width: 100%" placeholder="Enter full name">
        </div>
        <div class="form-group" style="margin-top: 15px;">
          <label for="swal-email">Email Address</label>
          <input id="swal-email" type="email" class="form-control" style="width: 100%" placeholder="Enter email address">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'SUBMIT',
    cancelButtonText: 'CANCEL',
    confirmButtonColor: '#0056b3',
    cancelButtonColor: '#666',
    focusConfirm: false,
    customClass: {
      confirmButton: 'action-btn', // Reusing your action-btn style
      popup: 'swal-custom-popup'
    },
    preConfirm: () => {
      const name = (document.getElementById('swal-name') as HTMLInputElement).value;
      const email = (document.getElementById('swal-email') as HTMLInputElement).value;

      if (!name || !email) {
        Swal.showValidationMessage('Please enter both name and email');
        return false;
      }

      // Basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        Swal.showValidationMessage('Please enter a valid email address');
        return false;
      }

      return { name: name, email: email };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Logic after clicking submit
      console.log('User Data Entered:', result.value);
      this.addUserToDB(result.value)


      // Example: call your service here
      // this.userService.create(result.value).subscribe(...)
    }
  });
}

addUserToDB(data: any) {
    this.isLoading = true
    const body ={
    "name": data.name,
    "username": data.email
  }
    const url = BASE_URL+'/api/adduser';
 // console.log(body)

          const token = sessionStorage.getItem('token');

          const headers = { 'Authorization': 'Bearer '+token }

            // 3. Make the POST request
            this.http.post(url, body, { headers }).subscribe({
              next: (response:any) => {
              this.isLoading =false
              if(response.success){
                Swal.fire(
                  'Success',
                  response.message,
                  'success'
                )
                this.getUsers()

              }else{
                Swal.fire('Error', response.message, 'error');
              }


              },
              error: (error) => {

                this.isLoading =false
                console.error('Error occurred:', error);
                alert('Failed to create customer.');
              }
            });

}






assignRole(id: any) {
  Swal.fire({
    title: 'ASSIGN ROLE',
    text: 'Please select the role for this user',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Admin User',
    denyButtonText: 'Normal User',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#0056b3', // Your theme blue
    denyButtonColor: '#6c757d',    // Gray for normal user
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'action-btn', // Uses your CSS class
      denyButton: 'action-btn'     // Uses your CSS class
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Admin User clicked
      console.log(1, id);

      this.submitRole(id, 1)



    } else if (result.isDenied) {
      // Normal User clicked
      console.log(0, id);
      this.submitRole(id, 0)

      // Optional: Add success feedback
      // Swal.fire('Saved!', 'User assigned as Normal User', 'info');
    }
  });
}


submitRole(id: any, role: any) {
    const body = {
      "user_id": id,
      "role_id": role
    };


    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer '+token }


        this.http.post(BASE_URL + '/api/assignrole', body, { headers }).subscribe({
          next: (response: any) => {
            if(response.success){
              this.isLoading = false;
              Swal.fire({
                title: 'Success!',
                text: response.message,
                icon: 'success',
                confirmButtonColor: '#003366'
              }).then(() => {
                 this.showAllUser()
              });
            }else{
              this.isLoading = false;
              Swal.fire('Error', response.message, 'error');
            }
          },
          error: (error) => {
            console.error(error);
            this.isLoading = false;
            Swal.fire('Error', 'sosmething went wrong', 'error');
          }
        });

}

}
