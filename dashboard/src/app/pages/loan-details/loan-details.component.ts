import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BASE_URL } from 'app/pages/config';
import { lastValueFrom } from 'rxjs';
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

  activateLoan(id: any) {
    Swal.fire({
      title: 'Confirm Action',
      text: 'Do you want to approve this loan?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Reject',
      confirmButtonColor: '#16467A',
      cancelButtonColor: '#d33'
    }).then((result) => {

      if (result.isConfirmed) {

        // ✅ SECOND MODAL (Drag & Drop Upload)
        Swal.fire({
          title: 'Upload Contract(s)',
          html: `
          <div id="dropZone"
            style="
              border: 2px dashed #16467A;
              border-radius: 12px;
              padding: 30px;
              text-align: center;
              cursor: pointer;
              background: #f8fbff;
              transition: 0.3s;
            ">

            <p style="margin:0;font-size:16px;color:#16467A;font-weight:600;">
              Drag & Drop PDF files here
            </p>
            <p style="margin:6px 0;color:#777;">or</p>

            <button type="button"
              style="
                background:#16467A;
                color:#fff;
                border:none;
                padding:10px 18px;
                border-radius:6px;
                cursor:pointer;
                font-size:14px;
              ">
              Browse Files
            </button>

            <input id="fileInput" type="file" multiple accept="application/pdf"
              style="display:none;" />
          </div>

          <div id="fileList"
            style="
              margin-top:15px;
              max-height:150px;
              overflow:auto;
              text-align:left;
              font-size:14px;
            ">
          </div>
        `,
          confirmButtonText: 'Submit',
          confirmButtonColor: '#16467A',
          showCancelButton: true,
          cancelButtonColor: '#d33',

          didOpen: () => {
            const dropZone: any = document.getElementById('dropZone');
            const fileInput: any = document.getElementById('fileInput');
            const fileList: any = document.getElementById('fileList');

            let selectedFiles: File[] = [];

            // ✅ Open file picker
            dropZone.onclick = () => fileInput.click();

            fileInput.onchange = (e: any) => {
              addFiles(e.target.files);
            };

            // ✅ Drag events
            dropZone.addEventListener('dragover', (e: any) => {
              e.preventDefault();
              dropZone.style.background = '#e6f0ff';
            });

            dropZone.addEventListener('dragleave', () => {
              dropZone.style.background = '#f8fbff';
            });

            dropZone.addEventListener('drop', (e: any) => {
              e.preventDefault();
              dropZone.style.background = '#f8fbff';
              addFiles(e.dataTransfer.files);
            });

            // ✅ Add files
            function addFiles(files: FileList) {
              for (let i = 0; i < files.length; i++) {

                if (files[i].type !== 'application/pdf') {
                  Swal.showValidationMessage('Only PDF files are allowed');
                  continue;
                }

                selectedFiles.push(files[i]);
              }

              renderFiles();
            }

            // ✅ Display files
            function renderFiles() {
              fileList.innerHTML = "";

              selectedFiles.forEach((file, index) => {

                const div = document.createElement('div');
                div.style.cssText = `
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:8px;
                border-bottom:1px solid #ddd;
              `;

                div.innerHTML = `
                <span style="overflow:hidden;text-overflow:ellipsis;">
                  ${file.name}
                </span>

                <button style="
                  background:#d33;
                  color:#fff;
                  border:none;
                  padding:3px 8px;
                  border-radius:4px;
                  cursor:pointer;
                ">X</button>
              `;

                div.querySelector('button')!.onclick = () => {
                  selectedFiles.splice(index, 1);
                  renderFiles();
                };

                fileList.appendChild(div);
              });
            }

            // ✅ expose files to SweetAlert
            (window as any).getUploadedFiles = () => selectedFiles;
          },

          preConfirm: () => {
            const files = (window as any).getUploadedFiles();

            if (!files || files.length === 0) {
              Swal.showValidationMessage('Please upload at least one PDF');
              return false;
            }

            return files;
          }

        }).then((uploadResult) => {

          if (uploadResult.isConfirmed) {

            const files = uploadResult.value;

            this.isLoading = true;

            const token = sessionStorage.getItem('token');
            const headers = {
              Authorization: 'Bearer ' + token
            };

            const formData = new FormData();
            formData.append('loan_id', id);

            for (let i = 0; i < files.length; i++) {
              formData.append('contracts[]', files[i]);
            }

            // ✅ FINAL API CALL
            this.http.post(BASE_URL + '/api/activateloan', formData, { headers })
              .subscribe({
                next: (response: any) => {
                  this.isLoading = false;

                  if (response.success) {
                    Swal.fire({
                      title: 'Success!',
                      text: response.message,
                      icon: 'success',
                      confirmButtonColor: '#003366'
                    }).then(() => {
                      this.router.navigate(['/loans/all-loans']);
                    });
                  } else {
                    Swal.fire('Error', response.message, 'error');
                  }
                },
                error: (error) => {
                  console.error(error);
                  this.isLoading = false;
                  Swal.fire('Error', 'Upload failed', 'error');
                }
              });
          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.rejectLoan(id);
      }

    });
  }

rejectLoan(id: any) {
  Swal.fire({
    title: 'Reject Loan',
    text: 'Please enter the rejection reason:',
    input: 'textarea',
    inputPlaceholder: 'Type your reason here...',
    inputAttributes: {
      'aria-label': 'Rejection reason'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#003366',
    cancelButtonColor: '#d33',
    preConfirm: (reason) => {
      if (!reason) {
        Swal.showValidationMessage('Rejection reason is required');
      }
      return reason;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const reason = result.value;

      const body ={
        loan_id: id,
        reason: reason
      }

      console.log(body);
      this.sendLoanRejection(body);

    }
  });
}
  sendLoanRejection(body){
    const token = sessionStorage.getItem('token');
    if(!token){
      Swal.fire('Error', 'Token not found', 'error');
      return;
    }
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.post(BASE_URL + '/api/reject-loan', body,{headers}).subscribe({
      next: (response: any) => {
        if(response.success){
          Swal.fire('Success', 'Loan rejected successfully', 'success');
          this.getsingleLoan();
        }else{
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'Could not reject loan', 'error');
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

  // --- EDIT LOAN ---

  formatDateForInput(value: any): string {
    if (!value) return '';
    return String(value).slice(0, 10);
  }

  openEditLoanModal() {
    const loan = this.loanDetails?.loan;
    if (!loan) return;

    const original = {
      amount: loan.amount,
      balance: loan.balance,
      tenure: loan.tenure,
      next_payment_date: this.formatDateForInput(loan.next_payment_date)
    };

    Swal.fire({
      title: 'Edit Loan Details',
      width: '560px',
      html: `
        <style>
          .lms-edit-form { display:flex; flex-direction:column; gap:16px; text-align:left; font-family:'Inter',sans-serif; margin-top:6px; }
          .lms-edit-subtitle { color:#64748b; font-size:13px; margin:-10px 0 6px; }
          .lms-field label { display:block; font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
          .lms-input-wrap { position:relative; display:flex; align-items:center; }
          .lms-prefix { position:absolute; left:14px; color:#94a3b8; font-weight:700; font-size:13px; pointer-events:none; }
          .lms-input { width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:14px; font-weight:600; color:#0f172a; background:#f8fafc; box-sizing:border-box; transition:border-color .2s, box-shadow .2s, background .2s; font-family:'Inter',sans-serif; }
          .lms-input.has-prefix { padding-left:50px; }
          .lms-input:focus { outline:none; border-color:#003366; background:#fff; box-shadow:0 0 0 3px rgba(0,51,102,0.08); }
          .lms-input.invalid { border-color:#f5365c; background:#fff5f6; }
          .lms-error { display:block; min-height:15px; color:#f5365c; font-size:11.5px; font-weight:600; margin-top:5px; }
        </style>
        <div class="lms-edit-form">
          <p class="lms-edit-subtitle">Only the fields you change will be saved.</p>

          <div class="lms-field">
            <label for="lms-amount">Principal Amount</label>
            <div class="lms-input-wrap">
              <span class="lms-prefix">ZMW</span>
              <input id="lms-amount" type="number" min="0" step="0.01" class="lms-input has-prefix" value="${original.amount ?? ''}">
            </div>
            <small class="lms-error" id="lms-err-amount"></small>
          </div>

          <div class="lms-field">
            <label for="lms-balance">Current Balance</label>
            <div class="lms-input-wrap">
              <span class="lms-prefix">ZMW</span>
              <input id="lms-balance" type="number" min="0" step="0.01" class="lms-input has-prefix" value="${original.balance ?? ''}">
            </div>
            <small class="lms-error" id="lms-err-balance"></small>
          </div>

          <div class="lms-field">
            <label for="lms-tenure">Loan Duration (Days)</label>
            <input id="lms-tenure" type="number" min="1" step="1" class="lms-input" value="${original.tenure ?? ''}">
            <small class="lms-error" id="lms-err-tenure"></small>
          </div>

          <div class="lms-field">
            <label for="lms-date">Next Repayment Date</label>
            <input id="lms-date" type="date" class="lms-input" value="${original.next_payment_date}">
            <small class="lms-error" id="lms-err-date"></small>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#1e293b',
      cancelButtonColor: '#94a3b8',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        const amountInput = document.getElementById('lms-amount') as HTMLInputElement;
        const balanceInput = document.getElementById('lms-balance') as HTMLInputElement;
        const tenureInput = document.getElementById('lms-tenure') as HTMLInputElement;
        const dateInput = document.getElementById('lms-date') as HTMLInputElement;

        const fieldInputs: { [key: string]: HTMLInputElement } = {
          amount: amountInput, balance: balanceInput, tenure: tenureInput, date: dateInput
        };
        Object.keys(fieldInputs).forEach((key) => {
          fieldInputs[key].classList.remove('invalid');
          const err = document.getElementById('lms-err-' + key);
          if (err) err.textContent = '';
        });

        const amount = amountInput.value.trim();
        const balance = balanceInput.value.trim();
        const tenure = tenureInput.value.trim();
        const nextDate = dateInput.value.trim();

        let hasError = false;
        const setErr = (key: string, input: HTMLInputElement, msg: string) => {
          input.classList.add('invalid');
          const err = document.getElementById('lms-err-' + key);
          if (err) err.textContent = msg;
          hasError = true;
        };

        if (amount === '' || isNaN(+amount) || +amount < 0) {
          setErr('amount', amountInput, 'Enter a valid principal amount');
        }
        if (balance === '' || isNaN(+balance) || +balance < 0) {
          setErr('balance', balanceInput, 'Enter a valid balance');
        }
        if (tenure === '' || isNaN(+tenure) || +tenure <= 0) {
          setErr('tenure', tenureInput, 'Enter a valid duration in days');
        }
        if (!nextDate) {
          setErr('date', dateInput, 'Select a repayment date');
        }

        if (hasError) {
          Swal.showValidationMessage('Please correct the highlighted fields');
          return false;
        }

        const payload: any = { loan_id: loan.id };
        let changed = false;

        if (+amount !== parseFloat(original.amount)) { payload.amount = +amount; changed = true; }
        if (+balance !== parseFloat(original.balance)) { payload.balance = +balance; changed = true; }
        if (+tenure !== parseInt(original.tenure, 10)) { payload.tenure = +tenure; changed = true; }
        if (nextDate !== original.next_payment_date) { payload.next_payment_date = nextDate; changed = true; }

        if (!changed) {
          Swal.showValidationMessage('No changes detected to save');
          return false;
        }

        const token = sessionStorage.getItem('token');
        const headers = { Authorization: 'Bearer ' + token };

        try {
          const response: any = await lastValueFrom(
            this.http.post(BASE_URL + '/api/loans/edit', payload, { headers })
          );
          return response;
        } catch (error: any) {
          const msg = error?.error?.message || 'Failed to update loan. Please try again.';
          Swal.showValidationMessage(msg);
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const response: any = result.value;
        if (response.success) {
          Swal.fire({
            title: 'Updated!',
            text: response.message || 'Loan details updated successfully.',
            icon: 'success',
            confirmButtonColor: '#1e293b'
          }).then(() => this.getsingleLoan());
        } else {
          Swal.fire('Error', response.message || 'Failed to update loan.', 'error');
        }
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

  viewContractFile(url: string) {
    if (!url) return;

    const fileUrl = BASE_URL +'/storage/'+ url;

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

 openPayoutModal(data: any, bankDetails: any) {
  const format = (val: any) => val ? val : '-';

  Swal.fire({
    title: 'Verify Disbursement Details',
    width: '800px',
    html: `
      <div style="text-align: left; font-family: 'Inter', sans-serif;">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <label style="font-size: 12px; font-weight: bold; color: #666;">TOTAL SUM (ZMK)</label>
            <div class="swal2-input">
             ${format(data?.total_sum || '')}
            </div>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold; color: #666;">RECIPIENT NAME</label>
            <div class="swal2-input">${format(data?.recipient_name || '')}</div>
          </div>
        </div>

        <h4 style="border-bottom: 1px solid #eee;">Deductions</h4>

        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td>Admin Fee</td>
            <td>ZMK ${format(data?.admin_fee_amount || '')}</td>
            <td>${data?.apply_admin_fee ? '✔' : '✖'}</td>
          </tr>
          <tr>
            <td>Change of Ownership</td>
            <td>ZMK ${format(data?.ownership_change_fee_amount || '')}</td>
            <td>${data?.apply_ownership_change_fee ? '✔' : '✖'}</td>
          </tr>
          <tr>
            <td>Removal of Caveat</td>
            <td>ZMK ${format(data?.caveat_removal_fee_amount || '')}</td>
            <td>${data?.apply_caveat_removal_fee ? '✔' : '✖'}</td>
          </tr>
        </table>

        <div style="background: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: right;">
          <b style="color: #4338ca;">NET PAYOUT:</b>
          <span style="font-size: 20px; font-weight: bold;">
            ZMK ${format(data?.net_payout_amount || '')}
          </span>
        </div>

        <h4 style="border-bottom: 1px solid #eee;">Banking Details</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="swal2-input">
          <lable style="font-size: 12px; font-weight: bold; color: #666;">BANK NAME</lable><br/>

               ${format(bankDetails.bank_name)}
          </div>
          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">ACCOUNT NUMBER</label><br/>
            ${format(bankDetails.account_number)}
          </div>
          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">BRANCH NAME</label><br/>
            ${format(bankDetails.branch_name)}
          </div>

          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">SORT CODE</label><br/>
            ${format(bankDetails.sort_code)}
          </div>

          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">SWIFT CODE</label><br/>
            ${format(bankDetails.swift_code)}
          </div>

        </div>

           <h4 style="border-bottom: 1px solid #eee;">Mobile Money Details</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">Mobile Money Name</label><br/>
               ${format(bankDetails.mobile_money_name)}
          </div>

          <div class="swal2-input">
          <label style="font-size: 12px; font-weight: bold; color: #666;">Mobile Money Number</label><br/>
            ${format(bankDetails.mobile_money_number)}
          </div>
        </div>



      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'confirm Payout',
    cancelButtonText: 'Cancel',

    confirmButtonColor: '#2563eb'
  }).then((result) => {
  if (result.isConfirmed) {
    console.log(this.id);
    const body = {
      loan_id: this.id
    };
    this.submitPayoutDetails(body);
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
                  .then(() => {
                    this.router.navigate(['/payouts/new-payout']);
                  });

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
