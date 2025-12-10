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
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}


  ngOnInit(): void {
    // Subscribing to changes in child routes
    this.route.url.subscribe(() => {
      // Access the last child segment of the current route
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;

      // Call the handler for the last child segment
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });
    this.getCategories()
  }

  handleRouteChange(route: string) {
    console.log(route);
    switch (route) {
      case 'initiate':
        this.showinitiate();
        break;
      case 'initiated':
        this.showinitiated();
        break;
      case 'pending':
        this.showpending();
        break;
      case 'approved':
        this.showapproved();
        break;
      case 'rejected':
        this.showrejected();
        break;
      default:
        break;
    }
  }

  isLoading=false;
  phoneNumbers: string[] = [];
  selectedFileName: string | null = null;
  message: string = '';
  maxCharacters: number = 250;
  sendButtonVisible: boolean = true;
  alternatives: string="";
  shimmer=false


  showFeelingInput: boolean = false;
  selectedFeeling: string = 'neutral';
  suggestions: string[] = [];

  initiate=true;
  initiated=false;
  pending=false;
  approved=false;
  rejected=false;
  showcategories=false;


  MessageData=[];
  catogories =[];

  showcategoryclick(){

    this.showcategories=true;

  }

  showcsvuploader(){

    this.showcategories=false;
  }


  getinitiated() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getInitiatedMessage', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#initedTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#initedTable').DataTable({
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
  getpending() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getpendingmessages', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#initedTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#initedTable').DataTable({
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
      this.http.get(BASE_URL + '/api/getapprovedMessage', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#initedTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#initedTable').DataTable({
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
  getrejected() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
      this.http.get(BASE_URL + '/api/getrejectedMessage', { headers }).subscribe((response: any) => {
        this.MessageData = response['data'];
        $('#initedTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#initedTable').DataTable({
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
      this.http.get(BASE_URL+'/api/approvedmessage/'+id, { headers }).subscribe((response:any)=>{

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


onCategorySelect(event: any, ){

  this.isLoading=true;
  const categoryId = event.target.value;
  const token = sessionStorage.getItem('token');
  const headers ={ 'Authorization': 'Bearer '+token}


  try {
    this.http.get(BASE_URL+'/api/categorycontacts/'+categoryId, { headers }).subscribe((response:any)=>{

      this.phoneNumbers=response['data']

      // Swal.fire({
      //   icon: 'success',
      //   title: 'success',
      //   text: response.message,
      // });

      // this.getpending()

      this.isLoading=false
    })
  }
  catch(error){
    console.log(error)
    this.isLoading=false
  }

}

onTemplateSelect(event: any,){
  this.isLoading=true;
  const templateId = event.target.value;

  if(templateId==1){
    this.message=`Dear Valued Customers,
We are currently experiencing intermittent service disruptions with [specific services], and our team is actively investigating the issue while working diligently to restore full service as quickly as possible.
Estimated time to resolution: [Insert estimated time if available, or "We will update you as soon as we have more information."]
We apologize for any inconvenience this may cause and appreciate your patience during this time. If you have any questions, please do not hesitate to contact our support team at [contact information].
Thank you for your understanding.
Best regards,
[Your Company Name] Customer Support Team`
  }else if(templateId==2){
    this.message=`Dear Valued Customers,
We are pleased to inform you that the service interruption affecting [specific services] has been resolved. Thank you for your patience as our team worked to restore service.
If you have any further questions or concerns, please reach out to our support team at [contact information].
Thank you for your continued support.
Best regards,
[Your Company Name] Customer Support Team`
  }

  this.isLoading=false;
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
  showinitiate(){
    this.initiate=true;
    this.initiated=false;
    this.pending=false;
    this.approved=false;
    this.rejected=false;
  }

  showinitiated(){
    this.initiate=false;
    this.initiated=true;
    this.pending=false;
    this.approved=false;
    this.rejected=false;
    this.getinitiated()
  }

  showpending(){
    this.initiate=false;
    this.initiated=false;
    this.pending=true;
    this.approved=false;
    this.rejected=false;
    this.getpending()
  }
  showapproved(){
    this.initiate=false;
    this.initiated=false;
    this.pending=false;
    this.approved=true;
    this.rejected=false;
    this.getapproved()
  }
  showrejected(){
    this.initiate=false;
    this.initiated=false;
    this.pending=false;
    this.approved=false;
    this.rejected=true
    this.getrejected()
  }





  onMessageBlur() {
    if (this.message.trim().length > 0) {
      this.showFeelingInput = true;
    }
  }
  generateAlternatives() {
    if (!this.message || !this.selectedFeeling) {
      console.error('Message and feeling must be provided');
      return;
    }

    this.shimmer = true;

    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      "target": "https://api.cloudflare.com/client/v4/accounts/d44683b7b55ed67eb723442964b18634/ai/run/@hf/nousresearch/hermes-2-pro-mistral-7b",
      "messages": [
        { "role": "system", "content": "You are a friendly assistant" },
        {
          "role": "user",
          "content": `Please rewrite the following message to convey a feeling of ${this.selectedFeeling} and and it should have a proffessional tone, keeping it as something I would directly send to a client: "${this.message}"`
        }
      ]
    };


    const proxyUrl = 'https://bytewavetechnologieszm.com/proxy';

    this.http.post(proxyUrl, body, { headers }).subscribe(
      (response: any) => {
        // console.log(response.result.response)
        // console.log(response['result']['response'])
        this.alternatives = response['result']['response'];
        // console.log(this.alternatives)
        this.shimmer = false;
      },
      (error) => {
        this.shimmer = false;
        console.error('Error generating alternatives', error);
      }
    );
  }







  parseStreamingResponse(responseText: string): string[] {
    const alternatives: string[] = [];
    const lines = responseText.trim().split('\n');

    for (const line of lines) {
      try {
        const jsonLine = JSON.parse(line);
        if (jsonLine.response) {
          alternatives.push(jsonLine.response);
        }
      } catch (error) {
        console.error('Error parsing line:', line, error);
      }
    }

    return alternatives;
  }


  onKeyPress(event: KeyboardEvent): void {
    if (this.message.length >= this.maxCharacters) {
        // event.preventDefault(); // Prevent further key presses
        this.sendButtonVisible = false; // Hide the send button
    } else {
        this.sendButtonVisible = true; // Show the send button
    }
}

onMessageChange(event: any): void {
  if (this.message.length > this.maxCharacters) {
      this.message = this.message.substring(0, this.maxCharacters);
      this.sendButtonVisible = false; // Hide the send button
  } else {
      this.sendButtonVisible = true; // Show the send button
  }
}

getCategories(){

  this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

  try {
    this.http.get(BASE_URL + '/api/categories', { headers }).subscribe((response: any) => {
      this.catogories = response['data'];
      // $('#initedTable').DataTable().clear().destroy();

      // setTimeout(() => {
      //   $('#initedTable').DataTable({
      //     pagingType: 'full_numbers',
      //     pageLength: 5,
      //     processing: true,
      //     lengthMenu: [5, 10, 25],
      //   });
      // }, 1);

      this.isLoading = false;
    });
  } catch (error) {
    console.log(error);
    this.isLoading = false;
  }




}


  // Method to handle file input change event
  handleFileInput(event: any) {
    this.isLoading = true;
    const file = event.target.files[0];
    if (file) {
      this.parseCSV(file);
    }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
    }

    this.isLoading = false;
  }

  // Method to parse CSV file
  parseCSV(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result;
      Papa.parse(csv, {
        header: true,
        dynamicTyping: false,  // Ensures numbers are treated as strings
        complete: (result) => {
          this.extractPhoneNumbers(result.data);
        }
      });
    };
    reader.readAsText(file);
  }

  // Method to extract phone numbers from the CSV data
  extractPhoneNumbers(data: any[]) {
    const phoneNumbers = data.map(row => {
      let phoneNumber = row['Phone Number'];

      // Clean up phone number if necessary
      if (phoneNumber) {
        phoneNumber = phoneNumber.toString().trim(); // Convert to string and trim any spaces
        phoneNumber = phoneNumber.replace('.00', ''); // Remove any decimals added by Excel
      }

      return phoneNumber;
    }).filter(num => num); // Filter out empty values

   console.log(phoneNumbers);
    this.phoneNumbers= phoneNumbers


    const invalidNumbers = this.phoneNumbers.filter(number => number.length !== 12);

  if (invalidNumbers.length > 0) {
    // Display the invalid numbers using SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Invalid Numbers',
      text: `The following numbers do not have a length of 12: ${invalidNumbers.join(', ')}`,
    });
  } else {
    // If all numbers are valid, show success alert
    Swal.fire({
      icon: 'success',
      title: 'All numbers are valid',
      text: 'All numbers have a length of 12.',
    });
  }

    // $('#phoneNumbersTable').DataTable().clear().destroy();

    // setTimeout(() => {
    //   $('#phoneNumbersTable').DataTable({
    //     pagingType: 'full_numbers',
    //     pageLength: 5,
    //     processing: true,
    //     lengthMenu: [5, 10, 25],
    //   });
    // }, 1);
  }


  // Method to extract phone numbers from parsed CSV data
  // extractPhoneNumbers(data: any[]) {
  //   this.phoneNumbers = data
  //     .map(row => row['Phone Numbers'] ? Big(row['Phone Numbers']).toFixed() : '')
  //     .filter(phone => phone !== ''); // Remove empty phone numbers
  //   // console.log(this.phoneNumbers);
  // }

  addData(data:any){
    this.isLoading = true;
    const token=sessionStorage.getItem('token');
      const headers ={ 'Authorization': 'Bearer '+token}
    const body ={
      "numbers":this.phoneNumbers,
      "message":this.message,

    };

    try {
      this.http.post(BASE_URL+'/api/initiatemessages',body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });



        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }


  }


}
