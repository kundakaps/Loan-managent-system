import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss']
})
export class LeaveApprovalComponent implements OnInit {

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

 isPending=false
 isApproved=false
 isLoading=false;
 pendingLeave:any=[]

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
      case 'pending-leave':
        this.showPendingLeave();
        break;
      case 'approved-leave':
        this.showApprovedLeave();
        break;

      default:
        break;
    }

  }

  showPendingLeave(){
    this.isPending=true
    this.isApproved=false
    this.getPendingLeave()
  }

  showApprovedLeave(){
    this.isApproved=true
    this.isPending=false
  }

  leaveTypeLowercase(leave_type:any): string {
    return leave_type.toLowerCase();
  }
  getPendingLeave(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/pendingleaveapplications', { headers }).subscribe((response:any)=>{
        this.pendingLeave=response.data
        console.log(this.pendingLeave)

        $('#leavepending').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#leavepending').DataTable({
            pagingType: 'full_numbers',
            pageLength: 15,
            processing: true,
            lengthMenu: [15, 25, 50],
            order: [[0, 'desc']]
          });

        }, 1);

      // console.log(this.employee)
        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }

  }



  actionPending(references: any, leaveType: any) {
    let htmlContent = `
      <button id="approveBtn" class="swal2-btn swal2-styled">Approve</button>
      <button id="rejectBtn" class="swal2-btn swal2-styled">Reject</button>
    `;

    // Add the View Document button conditionally
    const allowedLeaveTypes = [
      'Sick',
      'SICK',
      'Study',
      'STUDY',
      'MATERNITY',
      'PATERNITY',
      'FAMILY RESPONSIBILITY',
      'COMPASSIONATE'
    ];

    console.log(leaveType);
    if (allowedLeaveTypes.includes(leaveType)) {
      htmlContent += `
        <button id="viewDocBtn" class="swal2-btn swal2-styled">View Document</button>
      `;
    }

    Swal.fire({
      title: 'Action Pending',
      text: `Please choose an action for leave type: ${leaveType} and reference: ${references}`,
      icon: 'info',
      showCancelButton: false,
      showConfirmButton: false,
      focusCancel: false,
      html: htmlContent,
      didOpen: () => {
        const approveButton = document.getElementById('approveBtn');
        const rejectButton = document.getElementById('rejectBtn');
        const viewDocButton = document.getElementById('viewDocBtn');

        // Style buttons with your specified background color
        const buttonStyle = 'background-color: #A11F23; color: white; border: none; cursor: pointer; border-radius: 30px; padding: 15px; font-size: 12px';

        if (approveButton) approveButton.setAttribute('style', buttonStyle);
        if (rejectButton) rejectButton.setAttribute('style', buttonStyle);
        if (viewDocButton) viewDocButton.setAttribute('style', buttonStyle);

        // Attach click event handlers
        approveButton?.addEventListener('click', () => {
         // console.log('Button: Approve, Leave Type:', leaveType, 'Reference:', references);
         this.sendUpdateButton('approved',references,"")

          Swal.close();
        });

        rejectButton?.addEventListener('click', () => {
        // console.log('Button: Reject, Leave Type:', leaveType, 'Reference:', references);
         Swal.close();
          this.getRejectReason(references)


        });

        viewDocButton?.addEventListener('click', () => {
          this.viewDocBtn(references)
          Swal.close();
        });
      }
    });
  }

  getRejectReason(reference) {
    console.log('Reject');
    try {
      Swal.fire({
        title: 'Enter Rejection Reason',
        input: 'textarea',
        inputPlaceholder: 'Type your reason here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a reason.';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.sendUpdateButton('rejected', reference, result.value);
        }
      });
    } catch (error) {
      console.error('Error in displaying SweetAlert:', error);
    }
  }

  viewDocBtn(references){
       this.isLoading = true;
             const token = sessionStorage.getItem('token');
             const headers = { Authorization: 'Bearer ' + token };

             this.http.get(`${BASE_URL}/api/getleaveapplications/${references}`, { headers })
               .subscribe(
                 (response: any) => {
                   this.isLoading = false;
                   if (response.success) {
                     const supportingDoc = response.data.supporting_doc;
                     if (supportingDoc) {
                       this.showDocumentModal(supportingDoc, references, response.data.record_status);
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
                // this.SendFamilyDocUpdate(body)
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
                    // this.SendFamilyDocUpdate(body)
                   }
                 });
               });
             }
           }
         });
      }
  sendUpdateButton(status,reference, reason){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    const body={
      "leave_ref_no": reference,
      "status":  status,
      "reason": reason
  }
    try {
      this.http.post(BASE_URL+'/api/approveleaveapplications',body, { headers }).subscribe((response:any)=>{

        Swal.fire(
        'Success',
        response.message,
        'success'
      );

      this.showPendingLeave()
        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }



}
