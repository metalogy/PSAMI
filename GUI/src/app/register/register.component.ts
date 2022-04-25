import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Element} from "@angular/compiler";
import {GoogleMap} from "@angular/google-maps";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('mapSearchField') searchField!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;
  form: any = {
    username: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    dob: null,
    city: null,
    avatar: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  startDate = new Date(1990, 0, 1);

  mapConfig = {
    disableDefaultUI: true,
    zoomControl: true
  }

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const {username, email, password} = this.form;
    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement,);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement,);
  }
}
