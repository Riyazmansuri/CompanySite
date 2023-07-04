import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static isLoggedIn() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {

  }

  apiUrl = ' http://localhost:8080/users'
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


  proceedRegister(inputData: any, role: string): Observable<boolean> {
    const { email, password } = inputData;
    const userData = { email, password, role: role };

    return this.http.post(this.apiUrl, userData).pipe(
      switchMap(() => this.checkEmailExists(email)),
      catchError(() => of(false))
    );
  }


  proceedLogin(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.apiUrl}`, loginData).pipe(
      catchError((error) => {
        console.error('Login failed', error);
        return of(null); // Return null if login fails
      })
    );
  }


  IsLoggedIn() {
    return sessionStorage.getItem('email') != null;
  }

  GetUserRole() {
    return sessionStorage.getItem('role') != null ? sessionStorage.getItem('role')?.toString() : '';
  }
}
