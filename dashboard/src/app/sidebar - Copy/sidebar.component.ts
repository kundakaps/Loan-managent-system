import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  restrictedToRole1?: boolean;
  restrictedToRole2?: boolean;
  restrictedToRole3?: boolean;
  restrictedToRole4?: boolean;
  restrictedToRole5?: boolean;
  restrictedToRole6?: boolean;


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
  restrictedToRole2?: boolean;
  restrictedToRole3?: boolean;
  restrictedToRole4?: boolean;
  restrictedToRole5?: boolean;
  restrictedToRole6?: boolean;
  children?: ChildRoute[];
  isOpen?: boolean;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },  // Accessible to all roles
  { path: '/profiles', title: 'Profile', icon: 'nc-single-02', class: '',restrictedToRole1: true, },
  { path: '/leave', title: 'Leave', icon: 'nc-calendar-60', class: '',restrictedToRole1: true, },
  { path: '/circulars', title: 'Circulars', icon: 'nc-bullet-list-67', class: '',restrictedToRole1: true, },
  { path: '/policies', title: 'Policies', icon: 'nc-paper', class: '',restrictedToRole1: true, },
  { path: '/staff-documentation', title: 'Staff Documentation', icon: 'nc-single-copy-04', class: '',restrictedToRole1: true, },
  { path: '/innovation-hub', title: 'Innovation Hub', icon: 'nc-bulb-63', class: '',restrictedToRole1: true, },
  { path: '/reports', title: 'Reports', icon: 'nc-book-bookmark', class: '',restrictedToRole1: true, },
  { path: '/branch-submission', title: 'Branch Submission', icon: 'nc-laptop', class: '',restrictedToRole1: true, },
  { path: '/faq', title: 'FAQs', icon: 'nc-alert-circle-i', class: '',restrictedToRole1: true, },

];


@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public menuItems: RouteInfo[];

  ngOnInit() {
    const userRoles = sessionStorage.getItem('role')?.split(',') || [];

    if (userRoles.includes('hr-1')) {
      // Role 1 can access the dashboard and other role 1 restricted routes
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/dashboard' || menuItem.restrictedToRole1);
    } else if (userRoles.includes('hr-1')) {
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

