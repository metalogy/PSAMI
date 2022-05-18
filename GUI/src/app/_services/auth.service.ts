import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
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
