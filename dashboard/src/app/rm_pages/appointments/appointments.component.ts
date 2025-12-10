import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  purpose = '';
  @ViewChild('editor') editorRef: ElementRef;
  editorInvalid: boolean = false; // Flag to track the invalid state

  // Apply the formatting commands to the contenteditable div
  applyFormat(command: string) {
    const editor = this.editorRef.nativeElement;

    // Apply text formatting commands like bold, italic, underline, etc.
    document.execCommand(command, false, null);

    editor.focus(); // Keep the focus on the editor
  }

  // Set font size via the dropdown menu
  applyFontSize(event: any) {
    const size = event.target.value; // Get the selected font size value
    document.execCommand('fontSize', false, size);
  }

  // Validate editor content on blur
  validateEditor() {
    const editorContent = this.editorRef.nativeElement.innerHTML.trim();
    if (!editorContent) {
      this.editorInvalid = true;
    } else {
      this.editorInvalid = false;
    }
  }





  isCreate = false
  isPending = false
  isApproved = false
  isDeclined = false
  isLoading

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  Appointments:any=[]


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


  }

  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'create':
        this.showCreate();
        break;
      case 'pending':
        this.showPending();
        break;
      case 'approved':
        this.showApproved();
        break;
      case 'declined':
        this.showDeclined();
        break;

      default:
        break;
    }

  }

  showCreate(){
    this.isCreate=true
    this.isPending=false
    this.isApproved=false
    this.isDeclined=false
  }

  showPending(){
    this.isCreate=false
    this.isPending=true
    this.isApproved=false
    this.isDeclined=false
    this.getAppointments('pending')
  }

  showApproved(){
    this.isCreate=false
    this.isPending=false
    this.isApproved=true
    this.isDeclined=false
    this.getAppointments('approved')
  }

  showDeclined(){
    this.isCreate=false
    this.isPending=false
    this.isApproved=false
    this.isDeclined=true
    this.getAppointments('declined')
  }


  Formdata(data: any) {
    this.isLoading=true
    const purpose = this.editorRef.nativeElement.innerHTML.trim();
    data.purpose = purpose;

 //   console.log(data)

    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer ' + token };



    try {
      this.http.post(BASE_URL + '/api/appointmentcreation', data,{ headers }).subscribe(
        (response: any) => {
          this.isLoading=false
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: response.message,
          });


        },
        (error: any) => {

          this.isLoading=false
          if (error.status === 401) {


            this.router.navigate(['/home']);


          } else {
            this.isLoading=false
            console.log(error);
          }
        }
      );
    } catch (error) {
      this.isLoading=false
      console.log(error);
    }

  }

  getAppointments(status){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/appointments/'+status, { headers }).subscribe((response:any)=>{
        this.Appointments=response['data']
        $('#AppointmentsPendingTable').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#AppointmentsPendingTable').DataTable({
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25],
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

  // Import SweetAlert2


  showDetails(id) {
      this.isLoading = true;
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };

      try {
        this.http.get(BASE_URL + '/api/appointment/' + id, { headers }).subscribe((response: any) => {


          // Ensure we handle undefined values gracefully
          const clientName = response['data'].client_name || 'N/A';
          const clientEmail = response['data'].client_email || 'N/A';
          const clientPhone = response['data'].client_phone || 'N/A';
          const clientAddress = response['data'].client_address || 'N/A';
          const meetingDate = response['data'].meeting_date || 'N/A';
          const status = response['data'].status || 'N/A';
          const purpose = response['data'].purpose || 'N/A';

          this.isLoading = false;


            //S
            const appointmentData = `
              <div style="text-align: left;">
                <div style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
                  <strong style="margin-right: 20px;font-size: 15px;">Client Name:</strong> <span style="font-size: 15px;">${clientName}</span>
                </div>

                <div style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
                  <strong style="margin-right: 20px;font-size: 15px;">Email:</strong> <span style="font-size: 15px;">${clientEmail}</span>
                </div>

                <div style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
                  <strong style="margin-right: 20px;font-size: 15px;">Phone:</strong> <span style="font-size: 15px;">${clientPhone}</span>
                </div>

                <div style="display: flex; justify-content: flex-start; margin-bottom: 8px;">
                  <strong style="margin-right: 20px;font-size: 15px;">Meeting Date:</strong> <span style="font-size: 15px;">${meetingDate}</span>
                </div>

                <div style="margin-bottom: 8px;">
                  <strong style="margin-right: 20pxfont-size: 15px;;">Address:</strong> <span style="font-size: 15px;">${clientAddress}</span>
                </div>

                <div style="margin-bottom: 8px;">
                  <strong style="margin-right: 20px;font-size: 15px;">Purpose:</strong> <span style="font-size: 15px;">${purpose}</span>
                </div>
              </div>
            `;



          // SweetAlert2 modal to display data
          Swal.fire({
            title: 'Appointment Details',
            html: appointmentData,  // HTML content for the modal
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Submit Report',
            confirmButtonColor: '#A11E23',
            preConfirm: () => {
              // Action when the "Submit Report" button is clicked
              this.submitReport(response.data.id);  // Call a method to handle report submission, if needed
            }
          });
        }, (error) => {
          console.error('Error:', error);
          this.isLoading = false;
        });
      } catch (error) {
        console.log('Caught Error:', error);
        this.isLoading = false;
      }
  }



  submitReport(id){
    this.router.navigate(['rm/appointment-details'],{queryParams:{id:id,}})
  }



}
