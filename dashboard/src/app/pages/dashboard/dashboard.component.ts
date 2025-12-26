import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';

// 1. CHANGE THIS IMPORT
import Chart from 'chart.js';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardData: any;
  isLoading = false;


  cashflowChart: any;
  loanStatusChart: any;

  constructor(private http: HttpClient, private route: Router) { }

  ngOnInit() {
    this.getDashboardData();
  }

  ngOnDestroy() {
    // Destroy charts to free memory
    if (this.cashflowChart) this.cashflowChart.destroy();
    if (this.loanStatusChart) this.loanStatusChart.destroy();
  }

   getDashboardData() {
    this.isLoading = true;
    const token = sessionStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };

    this.http.get(BASE_URL + '/api/dashboarddata', { headers }).subscribe(
      (response: any) => {
        console.log("API Response:", response); // Debugging line

        // 2. ASSIGN DATA
        this.dashboardData = response.data;
        this.isLoading = false;

        // 3. Render charts ONLY after data is set
        setTimeout(() => {
          this.initCharts();
        }, 100);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

initCharts() {
        if (!this.dashboardData) return;

        // --- Chart 1: Cashflow (Kept same as before) ---
        const ctx1 = document.getElementById('cashflowChart');
        if (ctx1) {
          this.cashflowChart = new Chart(ctx1 as any, {
            type: 'bar',
            data: {
              labels: ['Today\'s Financials'],
              datasets: [
                {
                  label: 'Expected',
                  data: [this.dashboardData.expected_sum_for_today || 0],
                  backgroundColor: '#003366',
                  borderColor: '#003366',
                  borderWidth: 1
                },
                {
                  label: 'Collected',
                  data: [this.dashboardData.sum_paid_today || 0],
                  backgroundColor: '#FBC02D',
                  borderColor: '#FBC02D',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
            }
          });
        }

        // --- Chart 2: Loan Portfolio (UPDATED) ---
        const ctx2 = document.getElementById('loanStatusChart');

        if (ctx2) {
          // 1. Get the values (Adding Pending Collateral)
          let active = this.dashboardData.total_active_loans || 0;
          let inactive = this.dashboardData.total_inactive_loans || 0;
          // Access the new data point
          let pending = this.dashboardData.total_pending_collateral_loans || 0;

          // 2. Setup Data and Colors
          // We add the Yellow color (#FBC02D) for Pending items to fit your theme
          let chartLabels = ['Active Loans', 'Pending Collateral', 'Inactive Loans'];
          let chartData = [active, pending, inactive];
          let chartColors = [
            '#003366', // Deep Blue (Active)
            '#FBC02D', // Yellow (Pending)
            '#e0e0e0'  // Grey (Inactive)
          ];

          // 3. Handle Empty State (If all are 0, show a placeholder)
          if (active === 0 && inactive === 0 && pending === 0) {
            chartData = [1];
            chartColors = ['#f4f4f4']; // Light placeholder grey
            chartLabels = ['No Data'];
          }

          this.loanStatusChart = new Chart(ctx2 as any, {
            type: 'doughnut',
            data: {
              labels: chartLabels,
              datasets: [{
                data: chartData,
                backgroundColor: chartColors,
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutoutPercentage: 70, // Makes the donut thinner
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 12
                }
              }
            }
          });
        }
  }
}
