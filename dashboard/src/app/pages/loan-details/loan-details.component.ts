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

     openPayoutModal() {
    Swal.fire({
      title: 'Disbursement Agreement',
      width: '800px',
      html: `
        <div class="swal-form" style="text-align: left; font-family: 'Inter', sans-serif;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <label style="display:block; font-size: 12px; font-weight: bold; color: #666;">TOTAL SUM (ZMK)</label>
              <input id="total_sum" type="number" class="swal2-input" style="width: 100%; margin: 5px 0;" placeholder="0.00">
            </div>
            <div>
              <label style="display:block; font-size: 12px; font-weight: bold; color: #666;">RECIPIENT NAME</label>
              <input id="recipient_name" type="text" class="swal2-input" style="width: 100%; margin: 5px 0;" placeholder="Mr/Ms/Mrs...">
            </div>
          </div>

          <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Deductions</h4>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 8px; text-align: left;">Type</th>
                <th style="padding: 8px;">Amount (ZMK)</th>
                <th style="padding: 8px;">Apply</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px;">Admin Fee</td>
                <td><input id="admin_fee" type="number" class="swal2-input" value="2000" style="width: 120px; height: 35px; margin: 0 auto; display: block;"></td>
                <td style="text-align: center;"><input id="apply_admin" type="checkbox" checked style="width: 20px; height: 20px;"></td>
              </tr>
              <tr>
                <td style="padding: 8px;">Change of Ownership</td>
                <td><input id="ownership_fee" type="number" class="swal2-input" value="2000" style="width: 120px; height: 35px; margin: 0 auto; display: block;"></td>
                <td style="text-align: center;"><input id="apply_ownership" type="checkbox" checked style="width: 20px; height: 20px;"></td>
              </tr>
              <tr>
                <td style="padding: 8px;">Removal of Caveat</td>
                <td><input id="caveat_fee" type="number" class="swal2-input" value="1000" style="width: 120px; height: 35px; margin: 0 auto; display: block;"></td>
                <td style="text-align: center;"><input id="apply_caveat" type="checkbox" checked style="width: 20px; height: 20px;"></td>
              </tr>
            </tbody>
          </table>

          <div style="background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: right;">
            <label style="font-weight: bold; color: #4338ca;">NET PAYOUT: </label>
            <span id="payout_display" style="font-size: 20px; font-weight: 800; color: #1e1b4b;">ZMK 0.00</span>
          </div>

          <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px;">Banking Details</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <input id="bank_name" class="swal2-input" placeholder="Bank Name" style="width: 100%; margin: 5px 0;">
            <input id="acc_no" class="swal2-input" placeholder="Account No" style="width: 100%; margin: 5px 0;">
            <input id="acc_name" class="swal2-input" placeholder="Account Name" style="width: 100%; margin: 5px 0;">
            <input id="phone" class="swal2-input" placeholder="Phone Number" style="width: 100%; margin: 5px 0;">
          </div>

          <div style="margin-top: 15px;">
             <label style="display:block; font-size: 12px; font-weight: bold; color: #666;">ACKNOWLEDGE NAME (I, ... acknowledge)</label>
             <input id="ack_name" class="swal2-input" style="width: 100%; margin: 5px 0;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Payout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      allowOutsideClick: false, // Prevents closing by clicking backdrop
      didOpen: () => {
        // Calculation Logic attached to UI elements
        const updatePayout = () => {
          const total = parseFloat((<HTMLInputElement>document.getElementById('total_sum')).value) || 0;

          const admin = (<HTMLInputElement>document.getElementById('apply_admin')).checked ?
                        parseFloat((<HTMLInputElement>document.getElementById('admin_fee')).value) || 0 : 0;

          const owner = (<HTMLInputElement>document.getElementById('apply_ownership')).checked ?
                        parseFloat((<HTMLInputElement>document.getElementById('ownership_fee')).value) || 0 : 0;

          const caveat = (<HTMLInputElement>document.getElementById('apply_caveat')).checked ?
                         parseFloat((<HTMLInputElement>document.getElementById('caveat_fee')).value) || 0 : 0;

          const net = total - (admin + owner + caveat);
          document.getElementById('payout_display')!.innerText = `ZMK ${net.toLocaleString()}`;
        };

        // Attach listeners to all relevant inputs
        const ids = ['total_sum', 'admin_fee', 'ownership_fee', 'caveat_fee', 'apply_admin', 'apply_ownership', 'apply_caveat'];
        ids.forEach(id => document.getElementById(id)?.addEventListener('input', updatePayout));
      },
      preConfirm: () => {
        // Collect all data
        const getVal = (id: string) => (<HTMLInputElement>document.getElementById(id)).value;
        const getCheck = (id: string) => (<HTMLInputElement>document.getElementById(id)).checked;

        // Simple validation
        if (!getVal('total_sum') || !getVal('recipient_name') || !getVal('acc_no')) {
          Swal.showValidationMessage('Please fill in required fields');
          return false;
        }

        // Return data object
        return {
          total_sum: parseFloat(getVal('total_sum')),
          recipient_name: getVal('recipient_name'),
          admin_fee_amount: parseFloat(getVal('admin_fee')),
          apply_admin_fee: getCheck('apply_admin'),
          ownership_fee_amount: parseFloat(getVal('ownership_fee')),
          apply_ownership_fee: getCheck('apply_ownership'),
          caveat_fee_amount: parseFloat(getVal('caveat_fee')),
          apply_caveat_fee: getCheck('apply_caveat'),
          net_payout_amount: parseFloat(document.getElementById('payout_display')!.innerText.replace(/[^\d.-]/g, '')),
          bank_name: getVal('bank_name'),
          account_no: getVal('acc_no'),
          account_name: getVal('acc_name'),
          phone_no: getVal('phone'),
          acknowledgement_name: getVal('ack_name'),
          client_signature_date: new Date().toISOString().split('T')[0],
          staff_signature_date: new Date().toISOString().split('T')[0]
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const collectedData = result.value;
        collectedData['loan_id'] =this.id
        console.log('--- PAYOUT DATA COLLECTED ---');
        this.submitPayoutDetails(collectedData);
        // This result.value is exactly what you should send to your Laravel function
       // Swal.fire('Success', 'Data logged to console!', 'success');
      }
    });
  }

  submitPayoutDetails(body:any){
            this.isLoading = true



              const url = BASE_URL+'/api/disbursement';


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
                  // .then(() => {
                  //   this.router.navigate(['/events/all-events']);
                  // });

                }else{
                  Swal.fire('Error', response.message, 'error');
                }

                  // Optional: Reset the form after success
                 // form.resetForm();
                },
                error: (error) => {

                  this.isLoading =false
                  console.error('Error occurred:', error);
                //  alert('Failed to create customer.');
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
