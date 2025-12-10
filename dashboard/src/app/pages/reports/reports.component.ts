import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

interface Employee {
  man_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  branch_description: string;
  group_affiliation: string;
  grade_description: string;
  employment_status: string;
  basic_pay: number;
  doe: Date;
  end_of_service: Date;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  isEmployeeReport: boolean=false;
  isLoading= false;
  employees: Employee[] = []; // Your original data
  filteredEmployees: Employee[] = []; // Filtered data
  numberOfEmployees: number =0

  filters = {
    branch: '',
    groupAffiliation: '',
    grade: '',
    employmentStatus: '',
    basicPay: '',
    doeStart: '',
    doeEnd: '',
    eosStart: '',
    eosEnd: ''
  };
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
    this.getEmployees();
   this.filteredEmployees = this.employees;
  }

  applyFilters() {
    // If no employees, return empty array
    if (!this.employees || this.employees.length === 0) {
      this.filteredEmployees = [];
      return;
    }

    // Apply filters
    this.filteredEmployees = this.employees.filter(employee => {
      // Branch/Department filter
      const branchMatch = !this.filters.branch ||
        (employee.branch_description &&
         employee.branch_description.toLowerCase().includes(this.filters.branch.toLowerCase().trim()));

      // Group Affiliation filter
      const groupAffiliationMatch = !this.filters.groupAffiliation ||
        (employee.group_affiliation &&
         employee.group_affiliation.toLowerCase().includes(this.filters.groupAffiliation.toLowerCase().trim()));

      // Grade filter
      const gradeMatch = !this.filters.grade ||
        (employee.grade_description &&
         employee.grade_description.toLowerCase().includes(this.filters.grade.toLowerCase().trim()));

      // Employment Status filter
      const employmentStatusMatch = !this.filters.employmentStatus ||
        (employee.employment_status &&
         employee.employment_status.toLowerCase().includes(this.filters.employmentStatus.toLowerCase().trim()));

      // Basic Pay filter
      const basicPayMatch = !this.filters.basicPay ||
        (employee.basic_pay != null &&
         employee.basic_pay.toString().includes(this.filters.basicPay.trim()));

      // Date of Engagement range filter
      const doeStartMatch = !this.filters.doeStart ||
        (employee.doe && new Date(employee.doe) >= new Date(this.filters.doeStart));
      const doeEndMatch = !this.filters.doeEnd ||
        (employee.doe && new Date(employee.doe) <= new Date(this.filters.doeEnd));

      // End of Service range filter
      const eosStartMatch = !this.filters.eosStart ||
        (employee.end_of_service && new Date(employee.end_of_service) >= new Date(this.filters.eosStart));
      const eosEndMatch = !this.filters.eosEnd ||
        (employee.end_of_service && new Date(employee.end_of_service) <= new Date(this.filters.eosEnd));

      // Combine all filters
      return branchMatch &&
             groupAffiliationMatch &&
             gradeMatch &&
             employmentStatusMatch &&
             basicPayMatch &&
             doeStartMatch &&
             doeEndMatch &&
             eosStartMatch &&
             eosEndMatch;
    });

    // Optional: Log the number of filtered results
    this.numberOfEmployees = this.filteredEmployees.length
    //console.log(`Filtered ${this.filteredEmployees.length} employees`);
  }

  exportToCSV() {
    const rows = [];
    const headers = ['Man No', 'First Name', 'Middle Name', 'Last Name', 'Gender', 'Branch/Department', 'Group Affiliation', 'Grade', 'Employee Status', 'Basic Pay', 'Date of Engagement', 'End of Service'];
    rows.push(headers.join(','));

    this.filteredEmployees.forEach(employee => {
      const row = [
        employee.man_no,
        employee.first_name,
        employee.middle_name,
        employee.last_name,
        employee.gender,
        employee.branch_description,
        employee.group_affiliation,
        employee.grade_description,
        employee.employment_status,
        employee.basic_pay,
        this.formatDate(employee.doe),
        this.formatDate(employee.end_of_service)
      ];
      rows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToExcel() {
    const rows = [];
    const headers = ['Man No', 'First Name', 'Middle Name', 'Last Name', 'Gender', 'Branch/Department', 'Group Affiliation', 'Grade', 'Employee Status', 'Basic Pay', 'Date of Engagement', 'End of Service'];
    rows.push(headers.join('\t'));  // Tab-separated header row

    this.filteredEmployees.forEach(employee => {
      const row = [
        this.titleCase(employee.man_no),
        this.titleCase(employee.first_name),
        this.titleCase(employee.middle_name),
        this.titleCase(employee.last_name),
        this.titleCase(employee.gender),
        this.titleCase(employee.branch_description),
        this.titleCase(employee.group_affiliation),
        this.titleCase(employee.grade_description),
        this.titleCase(employee.employment_status),
        employee.basic_pay,
        this.formatDate(employee.doe),
        this.formatDate(employee.end_of_service)
      ];
      rows.push(row.join('\t'));  // Tab-separated data row
    });

    const excelContent = rows.join('\n');  // Join all rows with newlines

    // Convert to Excel file (just like CSV, but with .xls extension)
    const uri = 'data:application/vnd.ms-excel;base64,';
    const base64 = this.encodeToBase64(excelContent);
    const link = document.createElement('a');
    link.setAttribute('href', uri + base64);
    link.setAttribute('download', 'employees.xls');  // Download as .xls
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private titleCase(str: string): string {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private encodeToBase64(data: string): string {
    return btoa(unescape(encodeURIComponent(data)));
  }

  private formatDate(date: any): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear().toString().slice(-2)}`;
  }


  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'employee-report':
        this.showEmployeesReport();
        break;


      default:
        break;
    }

  }

  getEmployees(){
    this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/allemployees', { headers }).subscribe((response:any)=>{
        this.employees=response['data']
        $('#employeeTable').DataTable().clear().destroy();

        setTimeout(() => {
          var table = $('#employeeTable').DataTable({
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

  showEmployeesReport(){
    this.isEmployeeReport=true;
  }

}
