import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;



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

  children?: ChildRoute[];
  isOpen?: boolean;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },  // Accessible to all roles
  { path: '/customers', title: 'CUSTOMERS', icon: 'nc-single-02', class: '',
    children: [
      { path: 'add-customer', title: 'add customer',},
      { path: 'all-customers', title: 'all customers'},

    ]
  },
  { path: '/facilities', title: 'FACILITIES', icon: 'nc-tile-56', class: '',
    children: [
      { path: 'add-facility', title: 'add facility',},
      { path: 'all-facilities', title: 'all facilities'},

    ]
  },

    { path: '/loans', title: 'LOANS', icon: 'nc-single-copy-04', class: '',
    children: [
      { path: 'add-loan', title: 'add loan',},
      { path: 'all-loans', title: 'all loans'},

    ]
  },
  // { path: '/leave', title: 'Events', icon: 'nc-calendar-60', class: '',
  //   children: [
  //     { path: 'apply', title: 'add',},
  //     { path: 'history', title: 'View',},

  //   ]
  // },




  // { path: '/Settings',
  //   title: 'SETTINGS',
  //   icon: 'nc-settings-gear-65',
  //   class: '',


  //   children: [
  //     { path: 'holiday-maintenance', title: 'holiday maintenance',},
  //     // { path: 'all-employees', title: 'all employees',},

  //   ]
  // },


];


@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    public menuItems: RouteInfo[];

  ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }




    toggleDropdown(menuItem: RouteInfo) {
      menuItem.isOpen = !menuItem.isOpen; // Toggle the dropdown visibility
    }
}

