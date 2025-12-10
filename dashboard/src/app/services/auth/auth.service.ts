import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {

    const token = sessionStorage.getItem('token');
    return !!token;
  }
}
