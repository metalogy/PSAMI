import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from "./token-storage.service";
import {DatePipe} from "@angular/common";

const API = 'http://127.0.0.1:8000/';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

const headersUrlencoded = {
  headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private datePipe: DatePipe, private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  login(email: string, password: string): Observable<any> {

    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http.post(API + 'login', body.toString(), headersUrlencoded);
  }

  register(userData: any) {
    return this.http.post(API + 'user', userData.avatar,
      {
        params:
          {
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
            age: this.datePipe.transform(userData.age, "yyyy-MM-dd"),
            city: userData.city
          },
        headers: headers
      }
    );
  }

  getLoggedUserData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.get(API + 'who_am_i', {headers});
  }
}
