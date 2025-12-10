import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-events-details',
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.scss']
})
export class EventsDetailsComponent implements OnInit {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {}
  id: any;
  eventDetails: any=[];
  isLoading: boolean = false;


  @ViewChild('vipTicketsChart') vipChartCanvas!: ElementRef;
  @ViewChild('normalTicketsChart') normalChartCanvas!: ElementRef;

 ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.getEventsDetails()

     });

  }

  getEventsDetails() {
     this.isLoading=true
    const token = sessionStorage.getItem('token');

    const headers = { 'Authorization': 'Bearer '+token }
    this.http.get(`${BASE_URL}/api/eventdetails/${this.id}` , { headers }).subscribe({
      next: (response: any) => {
        this.eventDetails = response;
        console.log('Event Details:', this.eventDetails);
        this.isLoading = false;

        setTimeout(() => {
        this.createCharts();
      }, 0);
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch event details. Please try again later.',
        });
        this.isLoading = false;
      }
    });
  }

    createCharts(): void {
    // Add defensive checks to ensure the canvas elements are truly available
    if (this.vipChartCanvas && this.vipChartCanvas.nativeElement) {
      this.createVipChart();
    }
    if (this.normalChartCanvas && this.normalChartCanvas.nativeElement) {
      this.createNormalChart();
    }
  }

  createVipChart(): void {
    const data = this.eventDetails.data;
    new Chart(this.vipChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sold', 'Remaining'],
        datasets: [{
          data: [data.sold_vip_tickets, data.remaining_vip_tickets],
          backgroundColor: ['#FFC107', '#343A40'],
          borderColor: '#ffffff',
          borderWidth: 4
        }]
      },
      // Using correct options for Chart.js v2.9.4
      options: {
        responsive: true,
        cutoutPercentage: 70, // v2 uses `cutoutPercentage`
        legend: {
            display: false
        },
        tooltips: { // v2 uses `tooltips`
            backgroundColor: '#000000',
            titleFontSize: 14,
            bodyFontSize: 12,
            xPadding: 10,
            yPadding: 10,
            cornerRadius: 4,
            displayColors: false
        }
      }
    });
  }

  createNormalChart(): void {
    const data = this.eventDetails.data;
    new Chart(this.normalChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sold', 'Remaining'],
        datasets: [{
          data: [data.sold_normal_tickets, data.remaining_normal_tickets],
          backgroundColor: ['#FFC107', '#343A40'],
          borderColor: '#ffffff',
          borderWidth: 4
        }]
      },
      // Using correct options for Chart.js v2.9.4
      options: {
        responsive: true,
        cutoutPercentage: 70,
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: '#000000',
            titleFontSize: 14,
            bodyFontSize: 12,
            xPadding: 10,
            yPadding: 10,
            cornerRadius: 4,
            displayColors: false
        }
      }
    });
  }
}
