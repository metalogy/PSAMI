import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://127.0.0.1:8000/'
const httpOptionsLogin = {
  headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {

    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http.post(AUTH_API + 'login', body.toString(), httpOptionsLogin);

  }

  register(username: any, email: any, password: any, firstName: any, lastName: any,
           dob: any, photo: any, coords: any) {

    debugger;

    const registerData = new FormData();
    registerData.append("username", username);
    registerData.append("email", email);
    registerData.append("password", password);
    registerData.append("firstName", firstName);
    registerData.append("lastName", lastName);
    registerData.append("coords", coords);
    registerData.append("dob", username);
    registerData.append("photo", photo);

    return this.http.post(AUTH_API + 'signup', registerData);
  }
}
