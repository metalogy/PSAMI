import {Component} from '@angular/core';
import {TokenStorageService} from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  username = null;
  userId = null;

  constructor(private tokenStorageService: TokenStorageService) {
    tokenStorageService.isLogged.subscribe(val => {
      this.isLoggedIn = val;
    });

    tokenStorageService.userId.subscribe(userId => {
      this.userId = userId;
    });

    tokenStorageService.username.subscribe(username => {
      this.username = username;
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  getUserId(): number {
    return this.userId;
  }
}
