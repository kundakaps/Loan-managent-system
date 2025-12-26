import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  isLoading = false;
  id: any;
  loanDetails: any = null;
  role:any = sessionStorage.getItem('role');


  // File Upload Variables
  selectedFiles: File[] = [];
  isDragOver = false;

  // Form Variables
  collateralForm: FormGroup;
  isSubmitting = false;
  conditionOptions = ['Good', 'Fair', 'Poor', 'Needs Repair', 'Damaged'];

  ngOnInit(): void {
    // Exact Form initialization
    this.collateralForm = this.fb.group({
      number_plate: ['', Validators.required],
      engine_number: ['', Validators.required],
      chassis_number: ['', Validators.required],
      mileage: ['', Validators.required],
      cv_joints_condition: ['Good', Validators.required],
      shocks_condition: ['Good', Validators.required],
      control_arms_condition: ['Good', Validators.required],
      tires_condition: ['Good', Validators.required],
      body_condition: ['Good', Validators.required]
    });

    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
      if(this.id) {
        this.getsingleLoan();
      }
    });
  }

activateLoan(id:any){
  this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };
    const body = { 'loan_id': id };

    this.http.post(BASE_URL + '/api/activateloan', body, { headers }).subscribe({
      next: (response: any) => {
        if(response.success){
          this.isLoading = false;
          Swal.fire({
            title: 'Success!',
            text: response.message,
            icon: 'success',
            confirmButtonColor: '#003366'
          }).then(() => {
            this.router.navigate(['/loans/all-loans']);
          });
        }else{
          this.isLoading = false;
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        Swal.fire('Error', 'Could not load loan details', 'error');
      }
    });

   }



  // --- API FETCH ---
  getsingleLoan() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };
    const body = { 'loan_id': this.id };

    this.http.post(BASE_URL + '/api/singleloan', body, { headers }).subscribe({
      next: (response: any) => {
        this.loanDetails = response.data || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        Swal.fire('Error', 'Could not load loan details', 'error');
      }
    });
  }

  // --- LOGIC HELPERS ---

  showCollateralForm(): boolean {
    if (!this.loanDetails || !this.loanDetails.loan) return false;

    const status = this.loanDetails.loan.status?.toLowerCase();
    const hasData = this.loanDetails.collaterals !== null;

    // Show form if status is pending AND we don't have data yet
    return (status === 'pending collateral' || status === 'pending') && !hasData;
  }

  getPercentagePaid(): number {
    if (!this.loanDetails || !this.loanDetails.loan) return 0;
    const amount = parseFloat(this.loanDetails.loan.amount);
    const balance = parseFloat(this.loanDetails.loan.balance);
    const paid = amount - balance;
    if (amount === 0) return 0;
    return (paid / amount) * 100;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'pending collateral': return 'badge-warning';
      case 'closed': return 'badge-primary';
      case 'defaulted': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  // --- FILE VIEWER (SWEETALERT) ---
  viewFile(fileUrl: string) {
    if (!fileUrl) return;

    const extension = fileUrl.split('.').pop().toLowerCase();
    let htmlContent = '';
    let width = '600px';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      htmlContent = `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${fileUrl}" style="max-width: 100%; max-height: 500px; border-radius: 8px; margin-bottom: 20px;">
          <a href="${fileUrl}" target="_blank" download class="swal2-confirm swal2-styled" style="text-decoration: none; display: inline-flex; align-items: center;">
            <i class="fa fa-download" style="margin-right: 8px;"></i> Download
          </a>
        </div>
      `;
    }
    else if (extension === 'pdf') {
      width = '80%';
      htmlContent = `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <iframe src="${fileUrl}" style="width: 100%; height: 600px; border: none; margin-bottom: 20px; background: #f4f4f4;"></iframe>
          <a href="${fileUrl}" target="_blank" download class="swal2-confirm swal2-styled" style="text-decoration: none; display: inline-flex; align-items: center;">
            <i class="fa fa-download" style="margin-right: 8px;"></i> Download PDF
          </a>
        </div>
      `;
    }
    else {
      window.open(fileUrl, '_blank');
      return;
    }

    Swal.fire({
      title: 'Document Viewer',
      html: htmlContent,
      showConfirmButton: false,
      showCloseButton: true,
      width: width,
      background: '#fff'
    });
  }

  // --- FILE UPLOAD LOGIC ---

  onDragOver(event: any) {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = true;
  }
  onDragLeave(event: any) {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = false;
  }
  onFileDrop(event: any) {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = false;
    const files = event.dataTransfer.files;
    if (files.length > 0) this.handleFiles(files);
  }
  onFileBrowse(event: any) {
    const files = event.target.files;
    if (files.length > 0) this.handleFiles(files);
  }
  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  submitCollateral() {
    if (this.collateralForm.invalid) {
      Swal.fire('Warning', 'Please fill in all vehicle identification details.', 'warning');
      return;
    }

    this.isSubmitting = true;
    const loanId = this.loanDetails.loan.id;
    const dataPayload = { loan_id: loanId, ...this.collateralForm.value };
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.post(`${BASE_URL}/api/loan-collaterals`, dataPayload, { headers }).subscribe({
      next: (res: any) => {
        if (this.selectedFiles.length > 0) {
          this.uploadFiles(loanId, headers);
        } else {
          this.finishSubmission();
        }
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        Swal.fire('Error', 'Failed to save vehicle details.', 'error');
      }
    });
  }

  uploadFiles(loanId: any, headers: any) {
    const formData = new FormData();
    formData.append('loan_id', loanId);
    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file, file.name);
    });

    this.http.post(`${BASE_URL}/api/loan-collateral-files`, formData, { headers }).subscribe({
      next: (res) => { this.finishSubmission(); },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        Swal.fire('Warning', 'Details saved, but file upload failed.', 'warning');
      }
    });
  }

  finishSubmission() {
    this.isSubmitting = false;
    Swal.fire({
      title: 'Success!', text: 'Collateral successfully added!', icon: 'success', confirmButtonColor: '#003366'
    }).then(() => {
      window.location.reload();
    });
  }
}
