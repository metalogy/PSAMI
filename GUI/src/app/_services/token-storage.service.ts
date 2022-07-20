import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  @Output() isLogged: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  @Output() userId: EventEmitter<number> = new EventEmitter();

  userData: any = {};

  constructor() {
  }

  signOut(): void {
    this.isLogged.emit(false);
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    this.isLogged.emit(true);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public saveUserData(userData: any): void {
    this.userId.emit(userData.user.id);
    this.username.emit(userData.user.username);
    this.userData = userData.user;
  }

  public getUserAge(): any {
    return this.userData.age;
  }

  public getUserCity(): string {
    return this.userData.city; //todo
  }
}
