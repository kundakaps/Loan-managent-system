import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

 isAddEvents =false
 isAllEvents = false
 isLoading =false
 event: any = {
  location: '',
  title: '',
  description: '',
  start_date: '',
  start_time: '',
  ticket_id: 0,
  vip_tickets: 0,
  vip_price: 0,
  normal_tickets: 0,
  normal_price: 0
};
eventsdata:any=[]

 constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

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
      case 'add-event':
        this.showAddEvent();
        break;
      case 'all-events':
        this.showAllEvents();
        break;


      default:
        break;
    }

  }

  showAddEvent(){
    this.isAddEvents = true;
    this.isAllEvents = false;
  }
  showAllEvents(){
    this.isAllEvents = true;
    this.isAddEvents = false;
    this.getUserevents()
  }


  onSubmit() {
    this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.post(BASE_URL+'/api/events', this.event, { headers }).subscribe((response:any)=>{
        if(response.success){
          Swal.fire(
            'Success',
            'Event added successfully!',
            'success'
          ).then(() => {
            this.router.navigate(['/events/all-events']);
          });

        }else{
          Swal.fire('Error', response.message, 'error');
        }


        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }


  getUserevents(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/events', { headers }).subscribe((response:any)=>{

       this.eventsdata=response.data
      $('#eventsTable').DataTable().clear().destroy();

      setTimeout(() => {
        var table = $('#eventsTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 15,
          processing: true,
          lengthMenu: [15, 25, 50],
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

  detailspage(id:any){
      this.router.navigate(['/event-details'], { queryParams: { id } });
  }

  details(id:any){
    this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/eventdetails/'+id, { headers }).subscribe((response:any)=>{

       console.log(response.data)

       Swal.fire({
        title: '<strong style="color: #4a4a4a; font-size: 28px; font-weight: 700; font-family: \'Poppins\', sans-serif;">🎟️ Event Ticket Information</strong>',
        html: `
          <div style="
            text-align: left;
            color: #4a4a4a;
            margin-top: 20px;
            font-family: 'Poppins', sans-serif;
            padding: 0 10px;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
              padding: 12px;
              background: linear-gradient(90deg, rgba(255,193,7,0.1) 0%, rgba(255,255,255,1) 100%);
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            ">
              <span style="font-weight: 600; color: #6b6b6b;">VIP Tickets:</span>
              <span style="
                font-weight: 700;
                color: #FFC107;
                background: rgba(255,193,7,0.1);
                padding: 4px 10px;
                border-radius: 20px;
              ">${response.data.sold_vip_tickets} sold / ${response.data.remaining_vip_tickets} remaining</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
              padding: 12px;
              background: linear-gradient(90deg, rgba(33,150,243,0.1) 0%, rgba(255,255,255,1) 100%);
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            ">
              <span style="font-weight: 600; color: #6b6b6b;">Normal Tickets:</span>
              <span style="
                font-weight: 700;
                color: #2196F3;
                background: rgba(33,150,243,0.1);
                padding: 4px 10px;
                border-radius: 20px;
              ">${response.data.sold_normal_tickets} sold / ${response.data.remaining_normal_tickets} remaining</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
              padding: 12px;
              background: #f9f9f9;
              border-radius: 8px;
              border-left: 4px solid #FFC107;
            ">
              <span style="font-weight: 600; color: #6b6b6b;">Total VIP Tickets:</span>
              <span style="font-weight: 700; color: #4a4a4a;">${response.data.total_vip_tickets}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 12px;
              background: #f9f9f9;
              border-radius: 8px;
              border-left: 4px solid #2196F3;
            ">
              <span style="font-weight: 600; color: #6b6b6b;">Total Normal Tickets:</span>
              <span style="font-weight: 700; color: #4a4a4a;">${response.data.total_normal_tickets}</span>
            </div>
          </div>
        `,
        background: '#fff',
        showCloseButton: true,
        showConfirmButton: false,
        width: '500px',
        customClass: {
          container: 'swal2-container-custom',
          popup: 'swal2-popup-custom'
        }
      });
        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
  }

}
