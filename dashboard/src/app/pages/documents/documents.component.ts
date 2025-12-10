import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
}
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

 constructor(
  private http: HttpClient,
  private route: ActivatedRoute,
  private router: Router,
  private sanitizer: DomSanitizer
) {}

isCircular: boolean = false
isPolicies: boolean = false
isStaffDocuments: boolean = false

private readonly baseUrl = BASE_URL;
items: FileItem[] = [];
currentPath = '';
selectedPdfUrl: SafeResourceUrl | null = null;
selectedFileName = '';

  ngOnInit(): void {
     // Subscribing to changes in child routes
     this.route.url.subscribe(() => {
      // Access the last child segment of the current route
      const lastSegment = this.route.snapshot.firstChild?.url[0]?.path;
      if (lastSegment) {
        this.handleRouteChange(lastSegment);
      }
    });

  }
  handleRouteChange(route: string) {
    //console.log(route);
    switch (route) {
      case 'circulars':
        this.showCirculars();
        break;
      case 'policies':
        this.showPolicies();
        break;

      case 'staff-documents':
        this.showStaffDocuments();
        break;


      default:
        break;
    }
  }

  showCirculars(){
    this.isCircular=true;
    this.isPolicies=false
    this.isStaffDocuments=false
    this.loadDirectory('');
  }

  showPolicies(){
    this.isPolicies=true;
    this.isCircular=false
    this.isStaffDocuments=false
    this.loadDirectoryPolicies('');
  }
  showStaffDocuments(){
    this.isStaffDocuments=true;
    this.isCircular=false
    this.isPolicies=false
    this.loadDirectoryStaff('');

  }

  loadDirectory(path: string) {
    this.http.get<{currentPath: string, items: FileItem[]}>(
      `${this.baseUrl}/api/files/list`,
      { params: { path } }
    ).subscribe(response => {
      this.items = response.items;
      this.currentPath = response.currentPath;
    });
  }

  loadDirectoryPolicies(path: string) {
    this.http.get<{currentPath: string, items: FileItem[]}>(
      `${this.baseUrl}/api/files/policieslist`,
      { params: { path } }
    ).subscribe(response => {
      this.items = response.items;
      this.currentPath = response.currentPath;
    });
  }

  loadDirectoryStaff(path: string) {
    this.http.get<{currentPath: string, items: FileItem[]}>(
      `${this.baseUrl}/api/files/staffdocumentslist`,
      { params: { path } }
    ).subscribe(response => {
      this.items = response.items;
      this.currentPath = response.currentPath;
    });
  }

  handleItemClickPolicies(item: FileItem) {
    if (item.type === 'directory') {
      this.loadDirectoryPolicies(item.path);
    } else {
      this.selectedFileName = item.name;
      const url = `${this.baseUrl}/api/files/policiesview?path=${encodeURIComponent(item.path)}`;
      this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      // Open SweetAlert2 modal with embedded PDF viewer
      Swal.fire({
        title: 'Document Viewer',
        html: `
          <iframe src="${url}" width="100%" height="500px"></iframe>
        `,
        width: '80%',
        heightAuto: false,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Close',
      });
    }
  }

  handleItemClickStaff(item: FileItem) {
    if (item.type === 'directory') {
      this.loadDirectoryStaff(item.path);
    } else {
      this.selectedFileName = item.name;
      const url = `${this.baseUrl}/api/files/staffdocumentsview?path=${encodeURIComponent(item.path)}`;
      this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      // Open SweetAlert2 modal with embedded PDF viewer
      Swal.fire({
        title: 'Document Viewer',
        html: `
          <iframe src="${url}" width="100%" height="500px"></iframe>
        `,
        width: '80%',
        heightAuto: false,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Close',
      });
    }
  }


  handleItemClick(item: FileItem) {
    if (item.type === 'directory') {
      this.loadDirectory(item.path);
    } else {
      this.selectedFileName = item.name;
      const url = `${this.baseUrl}/api/files/view?path=${encodeURIComponent(item.path)}`;
      this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      // Open SweetAlert2 modal with embedded PDF viewer
      Swal.fire({
        title: 'PDF Viewer',
        html: `
          <iframe src="${url}" width="100%" height="500px"></iframe>
        `,
        width: '80%',
        heightAuto: false,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Close',
      });
    }
  }


  navigateToPath(path: string) {
    this.loadDirectory(path);
  }

  navigateToPathPolicies(path: string) {
    this.loadDirectoryPolicies(path);
  }


  navigateToPathStaff(path: string) {
    this.loadDirectoryStaff(path);
  }

  getCurrentPathSegments(): string[] {
    return this.currentPath ? this.currentPath.split('/') : [];
  }

  getPathUpToIndex(index: number): string {
    return this.getCurrentPathSegments()
      .slice(0, index + 1)
      .join('/');
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
