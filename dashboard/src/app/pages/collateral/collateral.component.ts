import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss']
})
export class CollateralComponent implements OnInit {

  isAddCollateral = false;
  isAddedCollateral = false;
  isLoading = false;
  isDragOver = false;
  selectedFiles: File[] = [];

  pendingLoans: any[] = [];
  selectedLoan: any = null;
  assessmentForm!: FormGroup;
  isSubmitting = false;
  loanId: any;
  clientId: any;



  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.url.subscribe(() => {
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });
  }

  onLoanSearch(event: any) {
    const selectedName = event.target.value;

    // Find the loan object where the combined name matches the typed/selected value
    const selectedLoan = this.pendingLoans.find(loan =>
      `${loan.customer_first_name} ${loan.customer_last_name}` === selectedName
    );

    // If a match is found from the list, mimic the original dropdown change event
    if (selectedLoan) {
      const mockEvent = {
        target: {
          value: selectedLoan.client_id
        }
      };

      // Trigger your original function with the client_id it expects
      this.onLoanSelect(mockEvent);
    }
  }

  handleRouteChange(route: string) {
    switch (route) {
      case 'add-collateral':
        this.showAddCollateral();
        break;
      case 'added-collateral':
        this.showAddedCollateral();
        break;
      default:
        break;
    }
  }

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



  showAddCollateral() {
    this.isAddCollateral = true;
    this.isAddedCollateral = false;
    this.PendingCollateralLoans();
  }

  showAddedCollateral() {
    this.isAddCollateral = false;
    this.isAddedCollateral = true;
  }

  PendingCollateralLoans() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.get(`${BASE_URL}/api/pendingcollaterals`, { headers }).subscribe({
      next: (response: any) => {
        this.pendingLoans = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Fetch Error:", err);
        this.isLoading = false;
      }
    });
  }

  initForm() {
    this.assessmentForm = this.fb.group({
      // Hidden / Reference IDs
      customer_id: [''],
      //loan_id: [''],

      // Section 1: Identity
      details_match_whitebook: [false],
      car_make: ['', Validators.required],
      car_model: ['', Validators.required],
      manufacturing_year: ['', Validators.required],
      vehicle_number_plate: ['', Validators.required],
      vehicle_engine_number: [''],
      chassis_number: ['', Validators.required],
      vehicle_mileage: ['', Validators.required],

      // Section 2: Mechanical
      ball_joints: ['V.GOOD'],
      cv_joints: ['V.GOOD'],
      shocks: ['V.GOOD'],
      control_arms: ['V.GOOD'],
      tires_condition: ['GOOD'],

      // Section 3: Inventory
      has_extinguisher: [false],
      has_jack: [false],
      has_spare_wheel: [false],

      // Section 4: Condition (Previously missing from HTML)
      vehicle_interior: ['GOOD'],
      accident_history: ['NONE'],
      paint_condition: ['GOOD'],
      engine_condition: ['GOOD'],

      // Section 5: Financials
      market_value: ['', Validators.required],
     // amount_requested: [''],
    //  amount_approved: ['', Validators.required],
    });
  }

  onLoanSelect(event: any) {
    const loanId = event.target.value;
    this.loanId = loanId;
    this.selectedLoan = loanId

    if (this.selectedLoan) {
      // Patching values into the form
      this.clientId = event.target.value
      this.assessmentForm.patchValue({
      customer_id: event.target.value,

        //loan_id: this.selectedLoan.id,
        //amount_requested: this.selectedLoan.amount
      });
    } else {
      this.assessmentForm.reset();
    }
  }

  submitAssessment() {
   if (this.assessmentForm.valid) {
      // getRawValue() captures even disabled fields
      const formData = this.assessmentForm.getRawValue();


     this.isSubmitting = true;

    // formData.loan_id = this.loanId;
     formData.customer_id = this.clientId;

      console.log("FULL FORM DATA:", formData);



    // const loanId = this.loanDetails.loan.id;
    // const dataPayload = { loan_id: loanId, ...this.collateralForm.value };


    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.post(`${BASE_URL}/api/vehicle-assessment`, formData, { headers }).subscribe({
      next: (res: any) => {
        if (this.selectedFiles.length > 0) {

          this.uploadFiles(res.assessment, headers);
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
    } else {
      this.assessmentForm.markAllAsTouched();
      Swal.fire('Form Incomplete', 'Please fill in all required fields marked in red.', 'warning');
    }
  }


    uploadFiles(collateral_id: any, headers: any) {
      const formData = new FormData();
      formData.append('collateral_id', collateral_id);
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
