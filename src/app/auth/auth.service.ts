import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageKey = 'jwt-token';

  constructor(private router: Router) { }

  setToken(token: string, id: string, role: string) {
    localStorage.setItem(this.storageKey, token);
    localStorage.setItem('userId', id);
    localStorage.setItem('role', role);
  }
  getToken() {
    return localStorage.getItem(this.storageKey);
  }
  getUserId() {
    return localStorage.getItem('userId');
  }
  getRole() {
    return localStorage.getItem('role');
  }

  isTokenExpired(token?: string): boolean {
    if (!token) { token = this.getToken(); }
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }
  isLoggedIn() {
    return !this.isTokenExpired();
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }



  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

}
