import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}
  isApply=false;
  isLoading=false;
  isApprove=false;
  isHistory=false;
  LeaveType:any=[];
  holidays =[];
  LeaveHistory=[];
  LeaveApplications=[]
  document:string =''
  SelectedLeave:any


  leaveDoc=false
  leavePayDate=false
  reasonForApplying =false
  appliedFor = false
  familyResponsibilityDropdown=false

  startDate: string | null = null;
  endDate: string | null = null;
  businessDays: number | null = null;
  formData: FormData = new FormData();
  IsLeaveBalanceValid =true;
  appliedForCompassionate = false;

  onLeaveTypeChange(event: any): void {
    //console.log('Selected leave type:', event.target.value);

    this.SelectedLeave = event.target.value;
    this.IsLeaveBalanceValid =true

    if(event.target.value =='Annual'){
      this.leavePayDate=true;
      this.leaveDoc=false;
      this.reasonForApplying=false;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Sick'){
      this.leavePayDate=false;
      this.leaveDoc=true;
      this.reasonForApplying=true;
      this.appliedFor=true;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Study'){
      this.leavePayDate=false;
      this.leaveDoc=true;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Special'){
      this.leavePayDate=false;
      this.leaveDoc=false;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Commutation'){
      this.leavePayDate=true;
      this.leaveDoc=false;
      this.reasonForApplying=false;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Maternity'){
      this.leavePayDate=false;
      this.leaveDoc=true;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Without Pay'){
      this.leavePayDate=false;
      this.leaveDoc=false;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Compassionate'){
      this.leavePayDate=false;
      this.leaveDoc=true;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate=true

    }else if(event.target.value =='Paternity'){
      this.leavePayDate=false;
      this.leaveDoc=true;
      this.reasonForApplying=true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;

    }else if(event.target.value =='Family Responsibility'){
      this.leavePayDate=false;
      //this.leaveDoc=true;
     // this.reasonForApplying=true;
      this.familyResponsibilityDropdown= true;
      this.appliedFor=false;
      this.appliedForCompassionate = false;
    }


// Annual
// Sick
// Study
// Special
// Commutation
// Maternity
// Without Pay
// Compassionate
// Paternity
// Family Responsibility


  }

  familresponsbilityLleaveTyle(event: any): void {
    //console.log('Selected leave type:', event.target.value);

    this.SelectedLeave = event.target.value;

    if(event.target.value =='medical'){
     this.leaveDoc=true;
     this.reasonForApplying=true;
    }else{
      this.leaveDoc=false;
     this.reasonForApplying=false;
    }
// Annual
// Sick
// Study
// Special
// Commutation
// Maternity
// Without Pay
// Compassionate
// Paternity
// Family Responsibility


  }

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
      case 'apply':
        this.showApply();
        break;
      case 'history':
        this.showHistory();
        break;

      case 'approve':
        this.showApprove();
        break;


      default:
        break;
    }

  }

  showApply(){
    this.isApply=true
    this.isHistory=false
    this.isApprove=false
    this.GetLeaveType();
  }
  showHistory(){
    this.isApply=false
    this.isHistory=true
    this.isApprove=false
    this.getLeaveHistory();
  }

  showApprove(){
    this.isApply=false
    this.isHistory=false
    this.isApprove=true
  }



calculateBusinessDays() {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    let count = 0;

    while (start <= end) {
      const day = start.getDay();
      const dateString = start.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      // Check if the day is not Saturday (6) or Sunday (0) and not a holiday
      if (day !== 0 && day !== 6 && !this.isHoliday(dateString)) {
        count++;
      }

      start.setDate(start.getDate() + 1); // Increment the date by 1
    }

    this.businessDays = count;



  this.checkLeaveValidity(this.SelectedLeave,this.businessDays);

  }
}
checkLeaveValidity(leaveType: any, businessDays: any){

//console.log(leaveType, businessDays)

  if (leaveType =='Annual' || leaveType =='Commutation' || leaveType =='Special'){
    if (businessDays > this.LeaveType.leaveBalance[0].accruedLeaveDays) {
      this.IsLeaveBalanceValid = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can\'t apply for more days than what you have!',
      });
    }
  }else if(leaveType =='Study' ){
    if (businessDays > this.LeaveType.leaveBalance[0].study_leave) {
      this.IsLeaveBalanceValid = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can\'t apply for more days than what you have!',
      });
    }
  }

  else if(leaveType =='Maternity' || leaveType =='Paternity'){
    if (businessDays > this.LeaveType.leaveBalance[0].parental_leave) {
      this.IsLeaveBalanceValid = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can\'t apply for more days than what you have!',
      });
    }
  }

  else if(leaveType =='Family Responsibility'){
    if (businessDays > this.LeaveType.leaveBalance[0].family_responsibility) {
      this.IsLeaveBalanceValid = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can\'t apply for more days than what you have!',
      });
    }
  }
  else if(leaveType =='Compassionate'){
    if (businessDays > this.LeaveType.leaveBalance[0].compassionate) {
      this.IsLeaveBalanceValid = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can\'t apply for more days than what you have!',
      });
    }
  }
}

isHoliday(date: string): boolean {
  return this.holidays.some(holiday => holiday.date === date);
}


documentOnChange(event: any, field: string) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];

    // Validate if the file is a PDF
    if (file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please upload a valid PDF file!',
      });
      return; // Exit if it's not a PDF
    }

    // Clear existing file in FormData before appending new one
    this.formData.delete(field); // Delete the previous file if any

    // Append the new PDF file
    this.formData.append(field, file);

    // Update file name variables
    if (field === 'document') {
      this.document = file.name;
    }
  }
}
getLeaveHistory(){
  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.get(BASE_URL+'/api/leavehistory', { headers }).subscribe((response:any)=>{
      this.LeaveHistory=response.leaveHistory

      $('#leaveHistory').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#leaveHistory').DataTable({
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


  GetLeaveType(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/leavetype', { headers }).subscribe((response:any)=>{
        this.LeaveType=response
        this.holidays = response.holidays

        if (this.holidays.length === 0) {

          Swal.fire({
            icon: 'info',
            title: 'No Holidays Found',
            text: 'Kindly contact HR for more information...',
            confirmButtonText: 'OK'
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

  AddLeaveData(data: any) {
    const leaveTypeBalances = {
        'Annual': 'accruedLeaveDays',
        'Special': 'accruedLeaveDays',
        'Commutation':'accruedLeaveDays',
        'Study': 'study_leave',
        'Family Responsibility': 'family_responsibility',
        'Compassionate': 'compassionate',
        'Maternity':'parental_leave',
        'Paternity':'parental_leave',
    };


    this.checkLeaveValidity(data.leave_type, this.businessDays)
    // Check if leave type exists in leaveTypeBalances and the leave balance exists
    if (leaveTypeBalances[data.leave_type]) {
        const balanceKey = leaveTypeBalances[data.leave_type];
        const leaveBalance = this.LeaveType.leaveBalance?.[0]?.[balanceKey];

        if (leaveBalance === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Leave balance for ${data.leave_type} is not available!`
            });
            return;
        }

        if (this.businessDays > leaveBalance) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You can\'t apply for more days than what you have!'
            });
            return;
        }
    }

    // If validation passed, append the form data and submit
    this.formData.append('leave_type', data.leave_type);
    this.formData.append('startDate', data.start_date);
    this.formData.append('endDate', data.end_date);
    this.formData.append('date_draw_leave_pay', data.date_draw_leave_pay ?? "");
    this.formData.append('reason_for_applying', data.reason_for_applying ?? "");
    this.formData.append('appliedfor', data.appliedfor ?? "");
    this.formData.append('number_of_days', this.businessDays?.toString() ?? "");

    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + token };

    this.http.post(`${BASE_URL}/api/submitleaveapplications`, this.formData, { headers })
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.success) {
            Swal.fire('Success', response.message, 'success');
            this.router.navigate(['/leave/history'])
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

  exportToCSV(): void {
    const header = ['Leave Reference', 'Leave Type', 'Number of Days', 'Start Date', 'End Date', 'Status', 'Reason for Rejection'];
    const rows = this.LeaveHistory.map((history: any) => [
      history.leave_ref_no,
      history.leave_type,
      history.number_of_days,
      history.start_date,
      history.end_date,
      history.status,
      history.rejection_reason
    ]);

    const csvContent = this.convertToCSV(header, rows);
    this.downloadCSV(csvContent);
  }

  convertToCSV(header: string[], rows: any[]): string {
    const headerRow = header.join(',') + '\n';
    const rowsContent = rows.map(row => row.join(',')).join('\n');
    return headerRow + rowsContent;
  }

  downloadCSV(csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'leave-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  exportToExcel(): void {
    const header = ['Leave Reference', 'Leave Type', 'Number of Days', 'Start Date', 'End Date', 'Status', 'Reason for Rejection'];
    const rows = this.LeaveHistory.map((history: any) => [
      history.leave_ref_no,
      history.leave_type,
      history.number_of_days,
      history.start_date,
      history.end_date,
      history.status,
      history.rejection_reason
    ]);

    const excelContent = this.convertToExcel(header, rows);
    this.downloadExcel(excelContent);
  }

  convertToExcel(header: string[], rows: any[]): string {
    let excelContent = `<table><thead><tr>`;
    header.forEach(col => {
      excelContent += `<th>${col}</th>`;
    });
    excelContent += `</tr></thead><tbody>`;

    rows.forEach(row => {
      excelContent += `<tr>`;
      row.forEach(cell => {
        excelContent += `<td>${cell}</td>`;
      });
      excelContent += `</tr>`;
    });

    excelContent += `</tbody></table>`;
    return excelContent;
  }

  downloadExcel(excelContent: string): void {
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'leave-history.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }








getDocument(reference: any) {
  this.isLoading = true;
  const token = sessionStorage.getItem('token');
  const headers = { 'Authorization': 'Bearer ' + token };
  try {
    this.http.get(BASE_URL + '/api/getleaveapplications/' + reference, { headers }).subscribe((response: any) => {
      console.log(response.data);
      this.isLoading = false;
      const { end_date, leave_pay_date, leave_ref_no, leave_type, maker, number_of_days, start_date, status } = response.data;

      const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const centerX = pageWidth / 2;

        // Load and add the logo
        const img = new Image();
        img.src = 'assets/img/logo.png';

        img.onload = function() {
          // Calculate logo dimensions and position
          const logoWidth = 50;
          const logoHeight = (img.height * logoWidth) / img.width;
          const logoX = (pageWidth - logoWidth) / 2;

          // Add the logo
          doc.addImage(img, 'PNG', logoX, 10, logoWidth, logoHeight);

          // Set initial font style
          doc.setFont('helvetica');
          doc.setFontSize(16);

          // Title (positioned below logo)
          doc.setTextColor('#A11F23');
          doc.text('Leave Details', centerX, logoHeight + 30, { align: 'center' });

          // Reset style for content
          doc.setFontSize(12);
          doc.setTextColor('#333333');

          // Content array
          const content = [
            { label: 'Leave Type', value: leave_type },
            { label: 'Status', value: status },
            { label: 'Reference No', value: leave_ref_no },
            { label: 'Maker', value: maker },
            { label: 'Start Date', value: start_date  },
            { label: 'End Date', value: end_date },
            { label: 'Number of Days', value: number_of_days.toString() }
          ];

          let yPosition = logoHeight + 50; // Start content below logo and title
          const lineHeight = 10;

          // Add content
          content.forEach(item => {
            // Label (bold)
            doc.setFont('helvetica', 'bold');
            const textLine = `${item.label}: `;

            // Value (normal)
            doc.setFont('helvetica', 'normal');
            if (item.label === 'Status') {
              doc.setTextColor(status === 'COMPLETE' ? '#28A745' : '#DC3545');
            }

            // Combine label and value, center the text
            const fullText = `${textLine}${item.value}`;
            doc.text(fullText, centerX, yPosition, { align: 'center' });

            // Reset color for next item
            doc.setTextColor('#333333');
            yPosition += lineHeight;
          });

          doc.save('Leave_Details.pdf');
        };

        img.onerror = function() {
          // If logo fails to load, generate PDF without it
          console.warn('Logo failed to load, generating PDF without logo');

          // Set initial font style
          doc.setFont('helvetica');
          doc.setFontSize(16);

          // Title
          doc.setTextColor('#A11F23');
          doc.text('Leave Details', centerX, 30, { align: 'center' });

          // Reset style for content
          doc.setFontSize(12);
          doc.setTextColor('#333333');

          // Content array
          const content = [
            { label: 'Leave Type', value: leave_type },
            { label: 'Status', value: status },
            { label: 'Reference No', value: leave_ref_no },
            { label: 'Maker', value: maker },
            { label: 'Start Date', value: this.formatDate(start_date) },
            { label: 'End Date', value: this.formatDate(end_date) },
            { label: 'Number of Days', value: number_of_days.toString() }
          ];

          let yPosition = 50;
          const lineHeight = 10;

          // Add content
          content.forEach(item => {
            // Label (bold)
            doc.setFont('helvetica', 'bold');
            const textLine = `${item.label}: `;

            // Value (normal)
            doc.setFont('helvetica', 'normal');
            if (item.label === 'Status') {
              doc.setTextColor(status === 'COMPLETE' ? '#28A745' : '#DC3545');
            }

            // Combine label and value, center the text
            const fullText = `${textLine}${item.value}`;
            doc.text(fullText, centerX, yPosition, { align: 'center' });

            // Reset color for next item
            doc.setTextColor('#333333');
            yPosition += lineHeight;
          });

          doc.save('Leave_Details.pdf');
        };
      };

      // SweetAlert modal remains the same
      Swal.fire({
        title: `<h4 style="color:#A11F23; margin-bottom:10px;">Leave Details</h4>`,
        html: `
          <div>
          <img style="height: 100px;" src="assets/img/logo.png">
          </div>
          <div style="text-align:left; font-family:Arial, sans-serif; color:#333; line-height:1.6; padding:10px;">
            <p><strong>Leave Type:</strong> <span style="color:#007BFF;">${leave_type}</span></p>
            <p><strong>Status:</strong> <span style="color:${status === 'COMPLETE' ? '#28A745' : '#DC3545'};">${status}</span></p>
            <p><strong>Reference No:</strong> ${leave_ref_no}</p>
            <p><strong>Maker:</strong> ${maker}</p>
            <p><strong>Start Date:</strong> ${this.formatDate(start_date)  }</p>
            <p><strong>End Date:</strong> ${this.formatDate(end_date) }</p>
            <p><strong>Number of Days:</strong> ${number_of_days}</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Download as PDF',
        confirmButtonColor: '#007BFF',
        background: '#f9f9f9',
        width: '500px',
        customClass: {
          popup: 'shadow-lg rounded',
        },
        preConfirm: downloadPDF,
      });
    });
  } catch (error) {
    console.log(error);
    this.isLoading = false;
  }
}

formatDate(date: any): string {
  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);  // Pad with zero if day is less than 10
  const month = ('0' + (d.getMonth() + 1)).slice(-2);  // Pad with zero if month is less than 10
  const year = d.getFullYear().toString().slice(-2);  // Get the last 2 digits of the year

  return `${day}/${month}/${year}`;
}


}
