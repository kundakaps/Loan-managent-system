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
  { path: '/credit/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },



];


@Component({
  selector: 'app-credit-sidebar',
  templateUrl: './credit-sidebar.component.html',
  styleUrls: ['./credit-sidebar.component.scss']
})
export class CreditSidebarComponent implements OnInit {

  public menuItems: RouteInfo[];

  ngOnInit() {
    const userRoles = sessionStorage.getItem('role')?.split(',') || [];

    // Check if the user has the role 'rm-1'
    if (userRoles.includes('cr-1')) {
      // Role 1 can access the dashboard and other role 1 restricted routes
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/credit/dashboard' || menuItem.restrictedToRole1);
    } else if (userRoles.includes('cr-2')) {
      // Role 2 can access the dashboard and approvals
      this.menuItems = ROUTES.filter(menuItem => menuItem.path === '/credit/dashboard' || menuItem.restrictedToRole2);
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
