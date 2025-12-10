import { EventsService } from 'app/services/events.service';
import { DashboardDataService } from './../../services/dashboard-data.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit{


 @ViewChild('ticketsChart') private ticketsChartRef: ElementRef;
  @ViewChild('eventsChart') private eventsChartRef: ElementRef;
  userId:number=0;
  constructor(private http: HttpClient,private route: Router) { }


    dashboardData:any =[];
    isLoading =false;
    ngOnInit(){
    //  this.getDashboardData()
    }


    getDashboardData(){
      this.isLoading=true;
      const token = sessionStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer '+token }
      try {
        this.http.get(BASE_URL + '/api/dashboard', { headers }).subscribe((response: any) => {
          this.dashboardData = response;
         // console.log(this.dashboardData);
          this.isLoading = false;

             setTimeout(() => {
                  if (!this.isLoading) {
                      this.createTicketsChart();
                      this.createEventsChart();
                  }
              }, 0);
        });
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    }

  //     ngAfterViewInit(): void {
  //   // We need to wait until the view is initialized and *ngIf has rendered the canvases
  //   // A timeout of 0 pushes the chart creation to the next change detection cycle
  //   setTimeout(() => {
  //       if (!this.isLoading) {
  //           this.createTicketsChart();
  //           this.createEventsChart();
  //       }
  //   }, 0);
  // }

  createTicketsChart(): void {
    const data = this.dashboardData.data;
    new Chart(this.ticketsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['VIP Tickets', 'Normal Tickets'],
        datasets: [{
          data: [data.totalVipTickets, data.totalNormalTickets],
          backgroundColor: [
            '#FFC107', // Yellow for VIP
            '#212529'  // Black for Normal
          ],
          borderColor: '#ffffff',
          borderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 75,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: '#333',
            fontFamily: 'Arial, sans-serif'
          }
        },
        tooltips: {
          backgroundColor: '#000'
        }
      }
    });
  }

  createEventsChart(): void {
    const data = this.dashboardData.data;
    new Chart(this.eventsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Upcoming Events', 'Past Events'],
        datasets: [{
          label: 'Number of Events',
          data: [data.upcomingEvents, data.pastEvents],
          backgroundColor: [
            'rgba(255, 193, 7, 0.7)', // Yellow with transparency
            'rgba(33, 37, 41, 0.7)'   // Black with transparency
          ],
          borderColor: [
            '#FFC107',
            '#212529'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false // Hiding legend as the title and axis labels are clear
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1, // Ensure y-axis has integer steps for event counts
              fontColor: '#333'
            },
             gridLines: {
                display: false
             }
          }],
          xAxes: [{
             ticks: {
                fontColor: '#333'
             },
             gridLines: {
                display: false
             }
          }]
        }
      }
    });
  }
}
