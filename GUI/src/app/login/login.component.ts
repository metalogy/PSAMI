import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: any = {
    email: null,
    password: null
  };

  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;

        this.authService.getLoggedUserData().subscribe({
          next: userData => {
            this.tokenStorage.saveUserData(userData);
          }
        })
        this.redirectHome()
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  redirectHome() {
    setTimeout(() => {
      setTimeout(() => {
        this.router.navigateByUrl("/home");
      });
    }, 1000);
  }
}
