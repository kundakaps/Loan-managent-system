import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

    purpose = '';
    @ViewChild('editor') editorRef: ElementRef;
    @ViewChild('customer_attendees') customer_attendees: ElementRef;
    @ViewChild('additional_attendees') additional_attendees: ElementRef;
    @ViewChild('primary_objectives') primary_objectives: ElementRef;
    @ViewChild('business_update') business_update: ElementRef;
    @ViewChild('financial_needs') financial_needs: ElementRef;
    @ViewChild('service_interest') service_interest: ElementRef;
    @ViewChild('opportunities') opportunities: ElementRef;
    @ViewChild('action_item') action_item: ElementRef;
    @ViewChild('client_feedback') client_feedback: ElementRef;
    @ViewChild('next_steps') next_steps: ElementRef;
    @ViewChild('internal_notes') internal_notes: ElementRef;

    editorInvalid: boolean = false;
    viewInitialized: boolean = false;
    id:any
    isLoading=false

    ngAfterViewInit() {
      this.viewInitialized = true;
    }

    applyFormat(command: string) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        document.execCommand(command, false, null);
      }
    }

    applyFontSize(event: any) {
      const size = event.target.value;
      document.execCommand('fontSize', false, size);
    }

    validateEditor() {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.hasAttribute('contenteditable')) {
        const content = activeElement.innerHTML.trim();
        this.editorInvalid = !content;
      }
    }

    constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];




     });
  }

  Formdata(data: any) {
    this.isLoading=true;
    if (!this.viewInitialized) {
      console.error('View not initialized yet');
      return;
    }

    const editors = {
      customer_attendees: this.customer_attendees,
      additional_attendees: this.additional_attendees,
      primary_objectives: this.primary_objectives,
      business_update: this.business_update,
      financial_needs: this.financial_needs,
      service_interest: this.service_interest,
      opportunities: this.opportunities,
      action_item: this.action_item,
      client_feedback: this.client_feedback,
      next_steps: this.next_steps,
      internal_notes: this.internal_notes
    };

    // Safely get content from editors
    Object.keys(editors).forEach(key => {
      if (editors[key] && editors[key].nativeElement) {
        data[key] = editors[key].nativeElement.innerHTML.trim();
      } else {
        data[key] = ''; // or handle missing editor as needed
      }
    });

    data['appointment_id'] = this.id;

    const token = sessionStorage.getItem('token');
       //console.log("token is: "+token)
       const headers = { 'Authorization': 'Bearer ' + token };



       try {
         this.http.post(BASE_URL + '/api/savermreport', data,{ headers }).subscribe(
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


               this.route.navigate(['/home']);


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

}
