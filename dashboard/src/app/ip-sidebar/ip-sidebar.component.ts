import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  restrictedToRole1?: boolean;
  restrictedToRole2?: boolean;
  children?: ChildRoute[]; // Add children property here
  isOpen?: boolean;
}

export interface ChildRoute {  // Define the interface for children
  path: string;
  title: string;
}

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  restrictedToRole1?: boolean;
  restrictedToRole2?: boolean; // New property for role 2
  children?: ChildRoute[];
  isOpen?: boolean;
}

export const ROUTES: RouteInfo[] = [
    { path: '/ip/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },

    { path: '/ip/churchpayments', title: 'Church Payments', icon: 'nc-istanbul', class: '' },
    { path: '/ip/communitypayments', title: 'Community Payments', icon: 'nc-bank', class: '' },
    { path: '/ip/cashwithdraw', title: 'Cash Withdraw', icon: 'nc-money-coins', class: '' },

    {
      path: '/ip/erppayments',
      title: 'ERP PAYMENTS',
      icon: 'nc-single-copy-04',
      class: '',
      children: [
        { path: 'newpayment', title: 'New Payment' },



      ]
    },
    { path: '/ip/reports', title: 'Reports', icon: 'nc-single-copy-04', class: '' },


    {
      path: '/ip/schoolpayments',
      title: 'SCHOOL PAYMENTS',
      icon: 'nc-briefcase-24',
      class: '',
      children: [
        { path: 'newpayment', title: 'New Payment' },



      ]
    },

    {
      path: '/ip/utilitypayments',
      title: 'UTILITY PAYMENTS',
      icon: 'nc-single-copy-04',
      class: '',
      children: [
        { path: 'waterpayments', title: 'Water Payments' },



      ]
    },







];


@Component({
  selector: 'app-ip-sidebar',
  templateUrl: './ip-sidebar.component.html',
  styleUrls: ['./ip-sidebar.component.scss']
})
export class IpSidebarComponent implements OnInit {


  public menuItems: RouteInfo[];

  ngOnInit() {
    const userRole = sessionStorage.getItem('role');

    if (userRole === '1') {
      // Role 1 can access the dashboard and other role 1 restricted routes
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/dashboard' || menuItem.restrictedToRole1);
    } else if (userRole === '2') {
      // Role 2 can access the dashboard and approvalMessages
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/dashboard' || menuItem.restrictedToRole2);
    } else {
      // Other roles (not role 1 or 2) can access only non-restricted routes
      this.menuItems = ROUTES.filter(menuItem => !menuItem.restrictedToRole1 && !menuItem.restrictedToRole2);
    }

    // Initialize 'isOpen' to false for items with children
    this.menuItems.forEach(menuItem => {
      if (menuItem.children) {
        menuItem.isOpen = false;
      }
    });
  }


  toggleDropdown(menuItem: RouteInfo) {
    menuItem.isOpen = !menuItem.isOpen; // Toggle the dropdown visibility
  }

}
