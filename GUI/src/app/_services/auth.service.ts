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
    let pathParams =
      '?username=' + userData.username +
      '&first_name=' + userData.first_name +
      '&last_name=' + userData.last_name +
      '&email=' + userData.email +
      '&password=' + userData.password +
      '&age=' + userData.age.toISOString().split('T')[0] +
      '&city=' + userData.city;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', API + 'user/' + pathParams, false);

    if (userData.avatar != null) {
      const file = new FormData();
      file.append('file', userData.avatar, userData.avatar.name);
      xhr.send(file);
    } else {
      xhr.send();
    }

    return xhr.responseText;
  }

  getLoggedUserData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.get(API + 'who_am_i', {headers});
  }
}
