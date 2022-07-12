import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const USER_BACKEND = 'http://127.0.0.1:8000/user/';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
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

  register(userData: any) {
    return this.http.post(USER_BACKEND, JSON.stringify(userData), {headers: headers});
  }
}
