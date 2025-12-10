import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}
 isholidayMaintenance=false
 isLoading= false
 holidays:any=[]
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

  handleRouteChange(route: string)
  {
    //console.log(route);
      switch (route) {
        case 'holiday-maintenance':
          this.showHolidayMaintenance();
          break;


        default:
          break;
      }

  }
  showHolidayMaintenance(){
    this.isholidayMaintenance=true
    this.getHolidays();
  }

  getHolidays(){
    this.isLoading = true;
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: 'Bearer ' + token };

        this.http.get(`${BASE_URL}/api/holidays`, { headers })
          .subscribe(
            (response: any) => {
              this.isLoading = false;
              this.holidays=response
              //console.log(this.holidays)

              $('#holidayTable').DataTable().clear().destroy();

              setTimeout(() => {
                var table = $('#holidayTable').DataTable({
                  pagingType: 'full_numbers',
                  pageLength: 10,
                  processing: true,
                  lengthMenu: [10, 25, 50],
                  order: [[0, 'desc']],
                });

              }, 1);

            },
            (error) => {
              this.isLoading = false;
              Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
            }
          );
  }



  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);

    // Extract year, month, and day
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so we add 1 and pad with zero if needed
    const day = selectedDate.getDate().toString().padStart(2, '0'); // Pad day with zero if single digit

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    // Show SweetAlert2 modal with input field for holiday name
    Swal.fire({
      title: 'Enter Holiday Name',
      input: 'text',
      inputPlaceholder: 'Holiday name',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#A11E23', // Custom background color for Submit button
      preConfirm: (holidayName) => {
        // This function is triggered when the user clicks the Submit button
        if (!holidayName) {
          Swal.showValidationMessage('Please enter a holiday name');
          return false; // Prevent the modal from closing until a value is entered
        }
        return holidayName;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const holidayName = result.value; // The holiday name entered by the user
        // console.log("Full date:", formattedDate);
        // console.log("Year:", year);
        // console.log("Holiday Name:", holidayName);
        this.addHoliday(formattedDate, year, holidayName);
      }
    });
  }
  deleteHoliday(date:any) {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + token };

    this.http.delete(`${BASE_URL}/api/holidays/`+date, { headers })
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          if(response.status){
            Swal.fire(
              'Success',
              response.message,
             'success');
            this.getHolidays();
          }else{
            Swal.fire('Error', response.message, 'error');
          }

        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'An error occurred while fetching the document.', 'error');
        }
      );
  }

  addHoliday(date, year, holidayName) {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: 'Bearer'+ token };

    const body = {
      date: date,
      year: year,
      description: holidayName
    };

    this.http.post(`${BASE_URL}/api/holidays`, body, { headers })
     .subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.status){
            Swal.fire(
              'Success',
              response.message,
             'success');

          }else{
            Swal.fire('Error', response.message, 'error');
          }
          this.getHolidays();
        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Error', 'An error occurred while adding the holiday.', 'error');
        }
      );
  }

}
