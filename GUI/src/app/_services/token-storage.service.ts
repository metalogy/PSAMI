import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  userData: any = {};

  constructor() {
  }

  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public saveUserData(userData: any): void {
    //todo
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userId", userData.user.id)
    localStorage.setItem("username", userData.user.username)
    this.userData = userData.user;
  }

  public getIsLoggedIn(): boolean {
    return localStorage.getItem("isLoggedIn") === "true" ? true : false;
  }

  public getUserId(): number {
    return Number(localStorage.getItem("userId"));
  }

  public getUsername(): string {
    return localStorage.getItem("username");
  }

  public getUserAge(): any {
    return this.userData.age;
  }
}
