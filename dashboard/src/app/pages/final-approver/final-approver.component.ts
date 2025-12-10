import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import Big from 'big.js';
import { BASE_URL } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-final-approver',
  templateUrl: './final-approver.component.html',
  styleUrls: ['./final-approver.component.scss']
})
export class FinalApproverComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  isLoading=false;
  pending = false;
  approved = false;
  MessageData=[];

  ngOnInit(): void {

    this.route.url.subscribe(() => {
      // Access the last child segment of the current route
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;

      // Call the handler for the last child segment
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });

  }

  handleRouteChange(route: string) {
    console.log(route);
    switch (route) {

      case 'approved':
        this.showapproved();
        break;
      case 'pending':
        this.showpending();
        break;
      default:
        break;
    }
  }

  showapproved(){
    this.approved=true,
    this.pending=false;
    this.getapproved()
  }

  showpending(){
    this.approved=false,
    this.pending=true;
    this.getpending()
  }

  confirmApproval(id:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to approve the message?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true


      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }



      try {
        this.http.get(BASE_URL+'/api/finalapprovemessage/'+id, { headers }).subscribe((response:any)=>{

          Swal.fire({
            icon: 'success',
            title: 'success',
            text: response.message,
          });
          this.getpending();


          this.isLoading=false
        })
      }
      catch(error){
        console.log(error)
        this.isLoading=false
      }

      }

    });
  }

  confirmReject(id:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Please provide a reason for rejecting the message:",
      icon: 'warning',
      input: 'textarea',  // This adds a textarea input for the user to write the reason
      inputPlaceholder: 'Enter your reason for rejection here...',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // If the user confirms and writes a reason
        this.isLoading = true;

        // Log the rejection reason and the ID
        // console.log('Rejected message with ID:', id);
        // console.log('Rejection reason:', result.value);


      const token = sessionStorage.getItem('token');
      //console.log("token is: "+token)
      const headers = { 'Authorization': 'Bearer '+token }

        const body={
           "message_remark": result.value
        }

      try {
        this.http.post(BASE_URL+'/api/rejectmessage/'+id,body, { headers }).subscribe((response:any)=>{

          Swal.fire({
            icon: 'success',
            title: 'success',
            text: response.message,
          });
          this.getpending();


          this.isLoading=false
        })
      }
      catch(error){
        console.log(error)
        this.isLoading=false
      }

      }

    });
  }
  editMessage(messageId: number, message: string) {
    Swal.fire({
      title: 'Edit Message',
      input: 'textarea',
     // inputLabel: 'Message',
      inputValue: message,
      showCancelButton: true,
      confirmButtonText: 'Done',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const editedMessage = result.value;
        console.log('Message ID:', messageId);
        console.log('Edited Message:', editedMessage);
        this.isLoading = true;
        const token=sessionStorage.getItem('token');
          const headers ={ 'Authorization': 'Bearer '+token}
        const body= {
          message: editedMessage
        }
        try {
          this.http.put(BASE_URL+'/api/updatemessage/'+messageId,body, { headers }).subscribe((response:any)=>{

            Swal.fire({
              icon: 'success',
              title: 'success',
              text: response.message,
            });

            this.getpending()

            this.isLoading=false
          })
        }
        catch(error){
          console.log(error)
          this.isLoading=false
        }
      }
    });
  }


  getpending() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/pendingfinal', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#final').DataTable().clear().destroy();

        setTimeout(() => {
          $('#final').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
          });
        }, 1);

        this.isLoading = false;
      });
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  getapproved() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getfinalapprovedMessage', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#approvedTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#approvedTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
          });
        }, 1);

        this.isLoading = false;
      });
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }
}
