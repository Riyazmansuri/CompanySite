import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static isLoggedIn() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {

  }

  apiUrl = ' http://localhost:3000/user'
  GetAll() {
    return this.http.get(this.apiUrl);
  }

  GetUserbyCode(email: any) {
    return this.http.get(`${this.apiUrl}?email=${email}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.apiUrl}?email=${email}`;
    return this.http.get<any[]>(url).pipe(
      map(users => users.length > 0)
    );
  }


  proceedRegister(inputData: any, role: string) {
    const { email, password } = inputData;
    const userData = { email, password, role: role };
    return this.http.post(this.apiUrl, userData)
  }

  IsLoggedIn() {
    return sessionStorage.getItem('email') != null;
  }

  GetUserRole() {
    return sessionStorage.getItem('role') != null ? sessionStorage.getItem('role')?.toString() : '';
  }
}
