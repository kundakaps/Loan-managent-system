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
  { path: '/rm/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },
  {
    path: '/rm/appointments',
    title: 'APPOINTMENTS',
    icon: 'nc-single-copy-04',
    class: '',restrictedToRole1: true,
    children: [
      { path: 'create', title: 'Create' },
      { path: 'pending', title: 'Pending Approval' },
      { path: 'approved', title: 'Approved' },
      { path: 'declined', title: 'Declined' },


    ]
  },
  {
    path: '/rm/s-appointments',
    title: 'APPOINTMENTS',
    icon: 'nc-single-copy-04',
    class: '',restrictedToRole2: true,
    children: [
      { path: 'pending', title: 'Pending Approval',},
      { path: 'reports', title: 'Submitted Reports',},



    ]
  }


];


@Component({
  selector: 'app-rm-sidebar',
  templateUrl: './rm-sidebar.component.html',
  styleUrls: ['./rm-sidebar.component.scss']
})
export class RmSidebarComponent implements OnInit {

  public menuItems: RouteInfo[];

  ngOnInit() {
    const userRoles = sessionStorage.getItem('role')?.split(',') || [];

    // Check if the user has the role 'rm-1'
    if (userRoles.includes('rm-1')) {
      // Role 1 can access the dashboard and other role 1 restricted routes
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/rm/dashboard' || menuItem.restrictedToRole1);
    } else if (userRoles.includes('rm-2')) {
      // Role 2 can access the dashboard and approvals
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/rm/dashboard' || menuItem.restrictedToRole2);
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
