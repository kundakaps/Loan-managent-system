import { Component, OnInit } from '@angular/core';

export interface ChildRoute {
  path: string;
  title: string;
  restrictedToRole1?: boolean;
  restrictedToRole2?: boolean;// Added this for sub-menu control
  restrictedToRole0?: boolean;
  restrictedToRole3?: boolean;
}

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  restrictedToRole0?: boolean;
  restrictedToRole1?: boolean;
  restrictedToRole2?: boolean;
  restrictedToRole3?: boolean;
  children?: ChildRoute[];
  isOpen?: boolean;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'nc-bank', class: '' },
  {
    path: '/customers', title: 'CUSTOMERS', icon: 'nc-single-02', class: '',
    restrictedToRole1: true,
    restrictedToRole0: true,
    children: [
      { path: 'add-customer', title: 'add customer' },
      { path: 'all-customers', title: 'all customers' },
    ]
  },
  {
    path: '/facilities', title: 'FACILITIES', icon: 'nc-tile-56', class: '',restrictedToRole1: true,
    children: [
      { path: 'add-facility', title: 'add facility' },
      { path: 'all-facilities', title: 'all facilities' },
    ]
  },

    {
    path: '/payouts', title: 'Payouts', icon: 'nc-tile-56', class: '',
    restrictedToRole3: true,

    children: [
      { path: 'new-payout', title: 'new payout'},
      { path: 'payout-history', title: 'payout history'},
    ]
  },
    {
    path: '/collateral', title: 'Collateral', icon: 'nc-tile-56', class: '',restrictedToRole2: true,
    children: [
      { path: 'add-collateral', title: 'add collateral' },
      { path: 'added-collateral', title: 'added collateral' },
    ]
  },
  {
    path: '/loans', title: 'LOANS', icon: 'nc-single-copy-04', class: '',
    restrictedToRole0: true ,
    restrictedToRole1: true,
    children: [
      { path: 'add-loan', title: 'add loan' ,restrictedToRole0: true ,restrictedToRole1: true},
      { path: 'waiting-activation', title: 'waiting activation', restrictedToRole1: true }, // Added restriction
      { path: 'all-loans', title: 'all loans',restrictedToRole0: true ,restrictedToRole1: true },
    ]
  },
  {
    path: '/users', title: 'USERS', icon: 'nc-single-02', class: '',
    restrictedToRole1: true,
    children: [
     // { path: 'add-user', title: 'add user' },
      { path: 'all-users', title: 'all users' },
    ]
  },
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];

  ngOnInit() {
    const userRole = sessionStorage.getItem('role');

    // 1. Filter Top-Level Items
    // Removes entire sections (like USERS) if restricted
    let filteredRoutes = ROUTES.filter(item => {
      if (item.restrictedToRole1 && userRole !== '1') {
        return false;
      }else if (item.restrictedToRole2 && userRole !== '2') {
        return false;
      }else if (item.restrictedToRole3 && userRole !== '3') {
        return false;
      }
      return true;
    });

    // 2. Filter Child Items
    // Keeps the section (like LOANS) but removes specific links (like waiting-activation)
    this.menuItems = filteredRoutes.map(item => {
      if (item.children) {
        return {
          ...item,
          isOpen: false, // Initialize dropdown state here
          children: item.children.filter(child => {
            if (child.restrictedToRole1 && userRole !== '1') {
              return false;
            }
            return true;
          })
        };
      }
      return item;
    });
  }

  toggleDropdown(menuItem: RouteInfo) {
    // Close other menus if you want an accordion effect, or just toggle current
    menuItem.isOpen = !menuItem.isOpen;
  }
}
