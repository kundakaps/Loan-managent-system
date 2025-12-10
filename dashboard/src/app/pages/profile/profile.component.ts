import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

 isFamily: boolean = false
 isLoanApplication: boolean = false
 isQualification: boolean = false
 isPersonal: boolean = false
 employee=[]
 isLoading=false
 familyDoc: string = '';
 certificate:string = '';
 transcript:string = '';
 qualificationData=[]
 employeeDetails:any=[]

 ngOnInit(): void {

  // Subscribing to changes in child routes
  this.route.url.subscribe(() => {
   // Access the last child segment of the current route
   const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;
   if (lastSegment) {
     this.handleRouteChange(lastSegment);
   }
 });
 this.getSingleEmployee()

}

formData: FormData = new FormData();
formData1: FormData = new FormData();
currentStep = 1;

// All values corresponding to the form fields
formValues: any = {
  type_of_loan: '',
  loan_amount: '',
  loan_tunure_period: '',
  monthly_payments: '',
  basic_pay: '',
  fixed_allowance: '',
  total_fixed_income: '',
  paye: '',
  napsa: '',
  union_subscription: '',
  total_statutory_dues: '',
  net_pay: '',
  allowable_deductions: '',
  present_deductions: '',
  debt_ratio: '',
  purpose_of_loan: ''
};



// Call this method when moving to the next step
nextStep() {
  if (this.currentStep < 5) {
    this.currentStep++;
  }
}

// Call this method when going to the previous step
previousStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}

onSubmit() {
  console.log('Form submitted', this.formValues);
  // Process the final form submission here
}

// Method to update the formValues object with form data
updateFormValues(fieldName: string, value: any) {
  if (fieldName == 'basic_pay') {
    this.formValues['total_fixed_income'] = value;
  } else if (fieldName == 'fixed_allowance') {
    // Ensure both values are treated as numbers
    this.formValues['total_fixed_income'] = Number(value) + Number(this.formValues['basic_pay']);
  }else if(fieldName == 'paye'){
    this.formValues['total_statutory_dues'] = value;

  }else if(fieldName == 'napsa'){
    this.formValues['total_statutory_dues'] = Number(value) + Number(this.formValues['paye']);
    this.formValues['net_pay'] = Number(this.formValues['total_fixed_income']) - Number(this.formValues['total_statutory_dues']);

  }
  else if(fieldName == 'union_subscription'){
    this.formValues['total_statutory_dues'] = Number(value) + Number(this.formValues['paye'])+ Number(this.formValues['napsa']);
    this.formValues['net_pay'] = Number(this.formValues['total_fixed_income']) - Number(this.formValues['total_statutory_dues']);

  } else {
    this.formValues[fieldName] = value;
  }
}

// submitLoan(){
//   console.log(this.formValues);
// }




FamilyDoconChange(event: any, field: string) {
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
    if (field === 'familyDoc') {
      this.familyDoc = file.name;
    }
  }
}

TranscriptonChange(event: any, field: string) {
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
    this.formData1.delete(field); // Delete the previous file if any

    // Append the new PDF file
    this.formData1.append(field, file);

    // Update file name variables
    if (field === 'transcript') {
      this.transcript = file.name;
    }
  }
}

CertificateOnChange(event: any, field: string) {
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
    this.formData1.delete(field); // Delete the previous file if any

    // Append the new PDF file
    this.formData1.append(field, file);

    // Update file name variables
    if (field === 'certificate') {
      this.certificate = file.name;
    }
  }
}


handleRouteChange(route: string) {
  //console.log(route);
  switch (route) {
    case 'qualification':
      this.showQualification();
      break;
    case 'family':
      this.ShowFamily();
      break;

    case 'personal':
      this.showPersonal();
      break;
      case 'loan-application':
      this.showLoanApplication();
      break;


    default:
      break;
  }

}

showLoanApplication(){
  this.isLoanApplication=true
  this.isFamily = false;
  this.isQualification = false;
  this.isPersonal = false;
}
showQualification(){
  this.isQualification = true;
  this.isFamily = false;
  this.isPersonal = false;
  this.isLoanApplication=false;
  this.getEmployee()
  this.getQualificationData();
}

ShowFamily(){
  this.isFamily = true;
  this.isQualification = false;
  this.isPersonal = false;
  this.isLoanApplication=false;
  this.getEmployee()
}

showPersonal(){
  this.isPersonal = true;
  this.isFamily = false;
  this.isQualification = false;
  this.isLoanApplication=false;
}

getQualificationData(){
  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.get(BASE_URL+'/api/qualificationdata', { headers }).subscribe((response:any)=>{
      this.qualificationData=response
      // console.log(this.qualificationData)
      this.isLoading=false
    })
  }
  catch(error){
    console.log(error)
    this.isLoading=false
  }
}

getEmployee(){
  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.get(BASE_URL+'/api/employee', { headers }).subscribe((response:any)=>{
      this.employee=response

      $('#familyTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#familyTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 15,
          processing: true,
          lengthMenu: [15, 25, 50],
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

AddFamilyMember(data: any) {
  const file = this.formData.get('familyDoc'); // Get the file input from formData

  // Check if the file is empty or not a PDF
  if (!file || file['type'] !== 'application/pdf') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please upload a valid PDF file!',
    });
  } else {
    // Append other form data
    this.formData.append('first_name', data.first_name);
    this.formData.append('middle_name', data.middle_name);
    this.formData.append('last_name', data.last_name);
    this.formData.append('mobile_number', data.mobile_number);
    this.formData.append('gender', data.gender);
    this.formData.append('relationship', data.relationship);
    this.formData.append('date_of_birth', data.date_of_birth);
    this.formData.append('idType', data.idType);
    this.formData.append('idNumber', data.idNumber);
    this.formData.append('emailAdress', data.emailAdress);

    this.isLoading = true;
          const token = sessionStorage.getItem('token');
          const headers = { Authorization: 'Bearer ' + token };

          this.http.post(`${BASE_URL}/api/addfamilymember`, this.formData, { headers })
            .subscribe(
              (response: any) => {
                this.isLoading = false;
                if (response.success) {
                  Swal.fire(
                    'Success',
                    response.message,
                    'success');

                    this.ShowFamily()


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

AddQualification(data: any) {
  const file = this.formData1.get('certificate'); // Get the file input from formData

  // Check if the file is empty or not a PDF
  if (!file || file['type'] !== 'application/pdf') {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please upload a valid PDF file!',
    });
  } else {
    // Append other form data
    this.formData1.append('institution', data.institution);
    this.formData1.append('qualificationType', data.qualificationType);
    this.formData1.append('qualificationObtained', data.qualificationObtained);
    this.formData1.append('date_of_completion', data.date_of_completion);

    //console.log(this.formData1);

    this.isLoading = true;
          const token = sessionStorage.getItem('token');
          const headers = { Authorization: 'Bearer ' + token };

          this.http.post(`${BASE_URL}/api/addqualification`, this.formData1, { headers })
            .subscribe(
              (response: any) => {
                this.isLoading = false;
                if (response.success) {
                  Swal.fire(
                    'Success',
                    response.message,
                    'success');

                    this.showQualification()


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

deletefamilydoc(id:any){


  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this entry?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
  }).then((result) => {
    if (result.isConfirmed) {

  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.delete(BASE_URL+'/api/deletefamilydocument/'+id, { headers }).subscribe((response:any)=>{
      if(response.success){
        Swal.fire(
          'Success',
          'Family Document deleted successfully!',
         'success');
        this.getEmployee()
      }
      else{
        Swal.fire('Error', response.message, 'error');
      }
      this.isLoading=false
    })
  }
  catch(error){
    console.log(error)
    this.isLoading=false
  }
    } else {
      console.log('Deletion canceled');
    }
  });



}

deleteQualificationdoc(id:any){


  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this entry?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
  }).then((result) => {
    if (result.isConfirmed) {

  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.delete(BASE_URL+'/api/deletequalificationdocument/'+id, { headers }).subscribe((response:any)=>{
      if(response.success){
        Swal.fire(
          'Success',
          'Qualification Document deleted successfully!',
         'success');
        this.getEmployee()
      }
      else{
        Swal.fire('Error', response.message, 'error');
      }
      this.isLoading=false
    })
  }
  catch(error){
    console.log(error)
    this.isLoading=false
  }
    } else {
      console.log('Deletion canceled');
    }
  });






}
getSingleEmployee(){
  this.isLoading=true
  const token = sessionStorage.getItem('token');
  //console.log("token is: "+token)
  const headers = { 'Authorization': 'Bearer '+token }
  try {
    this.http.get(BASE_URL+'/api/employee', { headers }).subscribe((response:any)=>{
      this.employeeDetails=response
      //console.log(this.employeeDetails)



      this.isLoading=false
    })
  }
  catch(error){
    console.log(error)
    this.isLoading=false
  }

}

goToEdit(){

  this.router.navigate(['user-edit']);
}

}
